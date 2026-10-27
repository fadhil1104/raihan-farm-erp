const router = require('express').Router();
const { collections, DailyVault } = require('../models');
const { requireAuth } = require('../middleware/auth');

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
    await c.Model.bulkWrite(ops);
  }
  if (replace) await c.Model.deleteMany({ uid: { $nin: docs.map((d) => d.uid) } });
}

// GET /api/state -> whole app state (same shape the old localStorage object had)
router.get('/', requireAuth, async (req, res) => {
  res.json(await buildState(req.user.role));
});

// PUT /api/state -> sync app state to MongoDB (staff: POS, customer, and limited inventory fields)
// ?replace=true (admin) makes the database exactly match the payload - used by "Restore Backup"
router.put('/', requireAuth, async (req, res) => {
  const body = req.body || {};
  const isAdmin = req.user.role === 'admin';
  const replace = isAdmin && req.query.replace === 'true';
  for (const c of collections) {
    if (c.adminOnly && !isAdmin) continue;
    if (!Array.isArray(body[c.key])) continue;
    let items = body[c.key].filter((x) => x && x[c.keyField] !== undefined && x[c.keyField] !== null);
    if (c.key === 'inventory' && !isAdmin) {
      const ids = items.map((item) => String(item.id));
      const storedItems = await c.Model.find({ uid: { $in: ids } }).lean();
      const storedById = new Map(storedItems.map((item) => [String(item.id), item]));
      const staffEditableFields = ['stockKg', 'pricePerKg', 'stockQuantity', 'pricePerUnit', 'staffEditCount'];
      items = items.flatMap((item) => {
        const stored = storedById.get(String(item.id));
        if (!stored) return [];
        const storedData = Object.fromEntries(Object.entries(stored)
          .filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key)));
        const safeItem = { ...storedData, id: item.id };
        staffEditableFields.forEach((field) => {
          if (field in item) safeItem[field] = item[field];
        });
        return [safeItem];
      });
    }
    await syncCollection(c, items, replace);
  }
  if (body.dailyVault && typeof body.dailyVault === 'object') {
    const ops = Object.entries(body.dailyVault).map(([date, day]) => ({
      updateOne: { filter: { uid: date }, update: { $set: { ...day, date, uid: date } }, upsert: true }
    }));
    if (ops.length) await DailyVault.bulkWrite(ops);
  }
  res.json({ ok: true, savedAt: new Date().toISOString() });
});

module.exports = router;
