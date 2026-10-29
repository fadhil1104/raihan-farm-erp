const router = require('express').Router();
const { collections, DailyVault, InventoryItem, CashierEntry, PosSale } = require('../models');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { randomUUID } = require('node:crypto');

const META = ['_id', '__v', 'uid', 'seq', 'createdAt', 'updatedAt', 'signInAt'];
const clean = (doc) => { META.forEach((k) => delete doc[k]); return doc; };

async function buildState(role) {
  const entries = await Promise.all(collections.map(async (c) => {
    const rows = await c.Model.find().sort(c.sortNewest ? { createdAt: -1, _id: -1 } : { seq: 1 }).lean();
    return [c.key, rows.map(clean)];
  }));
  const state = Object.fromEntries(entries);
  if (role !== 'admin') {
    // Staff never receives PINs, payroll or attendance
    state.employees = state.employees.filter((employee) => !employee.archivedAt)
      .map(({ pin, phone, archivedAt, baseSalary, otRate, allowance, advance, ...rest }) =>
      ({ ...rest, baseSalary: 0, otRate: 0, allowance: 0, advance: 0 }));
    state.attendanceLogs = [];
  }
  state.dailyVault = {};
  (await DailyVault.find().lean()).forEach((d) => { state.dailyVault[d.date] = clean(d); });
  return state;
}

async function syncCollection(c, items, replace) {
  const docs = items.map((it, i) => ({ ...it, uid: String(it[c.keyField]), seq: i }));
  let result;
  if (docs.length) {
    const ops = docs.map((doc) => {
      if (!replace && c.insertOnly) {
        return { updateOne: { filter: { uid: doc.uid }, update: { $setOnInsert: doc }, upsert: true } };
      }
      const set = { ...doc }, onInsert = {};
      if (!replace && c.protect) c.protect.forEach((k) => { if (k in set) { onInsert[k] = set[k]; delete set[k]; } });
      const update = { $set: set };
      if (Object.keys(onInsert).length) update.$setOnInsert = onInsert;
      return { updateOne: { filter: { uid: doc.uid }, update, upsert: true } };
    });
    result = await c.Model.bulkWrite(ops);
  }
  if (replace) await c.Model.deleteMany({ uid: { $nin: docs.map((d) => d.uid) } });
  return result;
}

async function deductSoldInventory(sales) {
  const quantities = new Map();
  sales.forEach((sale) => {
    if (Array.isArray(sale.itemsDetails)) {
      sale.itemsDetails.forEach((detail) => {
        const id = String(detail.id || '');
        const field = detail.unitType === 'kg' ? 'stockKg' : 'stockQuantity';
        const quantity = Number(detail.quantity);
        if (id && Number.isFinite(quantity) && quantity > 0) {
          if (!quantities.has(id)) quantities.set(id, { field, quantity: 0 });
          quantities.get(id).quantity += quantity;
        }
      });
    } else {
      Object.entries(sale.itemsBreakdown || {}).forEach(([id, quantity]) => {
        const amount = Number(quantity);
        if (Number.isFinite(amount) && amount > 0) {
          if (!quantities.has(id)) quantities.set(id, { field: 'stockKg', quantity: 0 });
          quantities.get(id).quantity += amount;
        }
      });
    }
  });

  if (!quantities.size) return;
  const ops = [...quantities].map(([id, { field, quantity }]) => ({
    updateOne: { filter: { id }, update: { $inc: { [field]: -quantity } } }
  }));
  await InventoryItem.bulkWrite(ops);
}

// GET /api/state -> whole app state (same shape the old localStorage object had)
router.get('/', requireAuth, async (req, res) => {
  res.json(await buildState(req.user.role));
});

// PUT /api/state -> sync app state; staff inventory stock is changed only by stock additions and POS sales.
// ?replace=true (admin) makes the database exactly match the payload - used by "Restore Backup"
router.put('/', requireAuth, async (req, res) => {
  const body = req.body || {};
  const isAdmin = req.user.role === 'admin';
  const replace = isAdmin && req.query.replace === 'true';
  const newlyCreatedSales = [];
  for (const c of collections) {
    if (c.adminOnly && !isAdmin) continue;
    if (c.key === 'cashierEntries' && !replace) continue;
    if (!Array.isArray(body[c.key])) continue;
    if (c.key === 'inventory' && !isAdmin) continue;
    const items = body[c.key].filter((x) => x && x[c.keyField] !== undefined && x[c.keyField] !== null);
    const result = await syncCollection(c, items, replace);
    if (!isAdmin && c.key === 'posSales' && result?.upsertedIds) {
      Object.keys(result.upsertedIds).forEach((index) => {
        const sale = items[Number(index)];
        if (sale) newlyCreatedSales.push(sale);
      });
    }
  }
  if (!isAdmin) await deductSoldInventory(newlyCreatedSales);
  if (body.dailyVault && typeof body.dailyVault === 'object') {
    const ops = Object.entries(body.dailyVault).map(([date, day]) => ({
      updateOne: { filter: { uid: date }, update: { $set: { ...day, date, uid: date } }, upsert: true }
    }));
    if (ops.length) await DailyVault.bulkWrite(ops);
  }
  res.json({ ok: true, savedAt: new Date().toISOString() });
});

router.post('/cashier-entries', requireAuth, async (req, res) => {
  const { type } = req.body || {};
  const date = String(req.body?.date || '');
  const amount = Number(req.body?.amount);
  const takenBy = String(req.body?.takenBy || '').trim();
  const note = String(req.body?.note || '').trim();
  if (!['OPENING', 'WITHDRAWAL'].includes(type)) {
    return res.status(400).json({ error: 'Choose a valid cashier entry type.' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'A valid cashier date is required.' });
  }
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return res.status(400).json({ error: 'A valid cashier date is required.' });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Enter an amount greater than zero.' });
  }
  if (type === 'WITHDRAWAL' && !takenBy) {
    return res.status(400).json({ error: 'Enter the name of the person taking the cash.' });
  }

  const dayEntries = await CashierEntry.find({ date }).lean();
  const opening = dayEntries.find((entry) => entry.type === 'OPENING');
  if (type === 'OPENING' && opening) {
    return res.status(409).json({ error: 'Today’s opening cash has already been recorded.' });
  }
  if (type === 'WITHDRAWAL') {
    if (!opening) return res.status(409).json({ error: 'Record the day’s opening cash before recording a withdrawal.' });
    const [cashSales] = await PosSale.aggregate([
      { $match: { date, payment: 'CASH' } },
      { $group: { _id: null, total: { $sum: '$totalRs' } } }
    ]);
    const available = Number(opening.amount || 0)
      + Number(cashSales?.total || 0)
      - dayEntries.filter((entry) => entry.type === 'WITHDRAWAL')
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    if (amount > available) {
      return res.status(409).json({ error: `Withdrawal exceeds the available drawer balance of Rs. ${available.toLocaleString()}.` });
    }
  }

  const id = type === 'OPENING' ? `opening-${date}` : `withdrawal-${randomUUID()}`;
  const entry = {
    id,
    uid: id,
    seq: Date.now(),
    date,
    time: String(req.body?.time || ''),
    type,
    amount: Math.round(amount * 100) / 100,
    takenBy: type === 'WITHDRAWAL' ? takenBy : '',
    recordedBy: String(req.user.label || req.user.username),
    note
  };
  try {
    const saved = await CashierEntry.create(entry);
    res.status(201).json({ entry: clean(saved.toObject()) });
  } catch (err) {
    if (err.code === 11000 && type === 'OPENING') {
      return res.status(409).json({ error: 'Today’s opening cash has already been recorded.' });
    }
    throw err;
  }
});

router.delete('/cashier-entries', requireAuth, requireAdmin, async (req, res) => {
  const result = await CashierEntry.deleteMany({});
  res.json({ ok: true, deletedCount: result.deletedCount });
});

router.post('/inventory/:id/stock', requireAuth, async (req, res) => {
  const item = await InventoryItem.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ error: 'Inventory item not found' });

  const quantity = Number(req.body.quantity);
  const unitType = item.unitType || 'kg';
  if (!Number.isFinite(quantity) || quantity <= 0 || (unitType !== 'kg' && !Number.isInteger(quantity))) {
    return res.status(400).json({ error: unitType === 'kg'
      ? 'Enter a positive stock weight.'
      : 'Enter a positive whole stock quantity.' });
  }

  const stockField = unitType === 'kg' ? 'stockKg' : 'stockQuantity';
  const updated = await InventoryItem.findOneAndUpdate(
    { id: req.params.id },
    { $inc: { [stockField]: quantity } },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: 'Inventory item not found' });
  res.json({ id: updated.id, stockKg: updated.stockKg, stockQuantity: updated.stockQuantity });
});

module.exports = router;
