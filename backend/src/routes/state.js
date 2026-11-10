const router = require('express').Router();
const { collections, DailyVault, DailyPosCounter, InventoryItem, InventoryStockAddition, CashierEntry, PosSale, Customer, Receivable } = require('../models');
const { requireAuth, requireAdmin, requireWriter, requireStateWriter } = require('../middleware/auth');
const { todayStr } = require('../utils/time');
const { randomUUID } = require('node:crypto');

const META = ['_id', '__v', 'uid', 'seq', 'createdAt', 'updatedAt', 'signInAt'];
const clean = (doc) => { META.forEach((k) => delete doc[k]); return doc; };

async function buildState(role) {
  const entries = await Promise.all(collections.map(async (c) => {
    if (role === 'farm' && !['farmIntakes', 'slaughterBatches'].includes(c.key)) {
      return [c.key, []];
    }
    const rows = await c.Model.find().sort(c.sortNewest ? { createdAt: -1, _id: -1 } : { seq: 1 }).lean();
    return [c.key, rows.map(clean)];
  }));
  const state = Object.fromEntries(entries);
  if (role === 'farm') {
    state.inventory = (await InventoryItem.find().select('id name source unitType').lean())
      .filter((item) => (item.unitType || 'kg') === 'kg')
      .map(({ id, name, source, unitType }) => ({ id, name, source, unitType: unitType || 'kg' }));
  }
  if (role === 'staff') {
    // Staff never receives PINs, payroll or attendance
    state.staff = state.staff.filter((member) => !member.archivedAt)
      .map(({ pin, phone, archivedAt, baseSalary, otRate, allowance, advance, ...rest }) =>
      ({ ...rest, baseSalary: 0, otRate: 0, allowance: 0, advance: 0 }));
    state.attendanceLogs = [];
  }
  state.dailyVault = {};
  if (role !== 'farm') {
    (await DailyVault.find().lean()).forEach((d) => { state.dailyVault[d.date] = clean(d); });
  }
  return state;
}

async function syncCollection(c, items, replace) {
  const docs = items.map((it, i) => ({ ...it, uid: String(it[c.keyField]), seq: i }));
  let result;
  if (docs.length) {
    const ops = docs.map((doc) => {
      if (!replace && c.insertOnly) {
        const insertDoc = { ...doc };
        const update = { $setOnInsert: insertDoc };
        if (c.key === 'posSales' && doc.loyaltyRedemptionPrinted === true) {
          delete insertDoc.loyaltyRedemptionPrinted;
          delete insertDoc.loyaltyPointsBalanceAfter;
          update.$set = { loyaltyRedemptionPrinted: true };
          if (Number.isFinite(Number(doc.loyaltyPointsBalanceAfter))) {
            update.$set.loyaltyPointsBalanceAfter = Number(doc.loyaltyPointsBalanceAfter);
          }
        }
        return { updateOne: { filter: { uid: doc.uid }, update, upsert: true } };
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
    getSaleInventoryQuantities(sale).forEach(({ field, quantity }, id) => {
      if (!quantities.has(id)) quantities.set(id, { field, quantity: 0 });
      quantities.get(id).quantity += quantity;
    });
  });

  if (!quantities.size) return;
  const ops = [...quantities].map(([id, { field, quantity }]) => ({
    updateOne: { filter: { id }, update: { $inc: { [field]: -quantity } } }
  }));
  await InventoryItem.bulkWrite(ops);
}

function getSaleInventoryQuantities(sale) {
  const quantities = new Map();
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
  return quantities;
}

function validSaleDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function getEditedSaleInventoryQuantities(itemsDetails) {
  const quantities = new Map();
  for (const detail of itemsDetails) {
    const id = String(detail?.id || '');
    const unitType = String(detail?.unitType || '');
    const quantity = Number(detail?.quantity);
    if (!id || !['kg', 'packet', 'unit'].includes(unitType) || !Number.isFinite(quantity) || quantity <= 0 ||
        (unitType !== 'kg' && !Number.isInteger(quantity))) {
      return null;
    }
    const field = unitType === 'kg' ? 'stockKg' : 'stockQuantity';
    const current = quantities.get(id);
    if (current && current.field !== field) return null;
    quantities.set(id, { field, quantity: (current?.quantity || 0) + quantity });
  }
  return quantities;
}

async function applySaleInventoryDelta(oldQuantities, newQuantities) {
  const ids = new Set([...oldQuantities.keys(), ...newQuantities.keys()]);
  const inventory = new Map((await InventoryItem.find({ id: { $in: [...ids] } })).map((item) => [String(item.id), item]));
  const changes = [];

  for (const id of ids) {
    const oldQuantity = oldQuantities.get(id);
    const newQuantity = newQuantities.get(id);
    const oldField = oldQuantity?.field;
    const newField = newQuantity?.field;
    const item = inventory.get(id);
    if (!item && newQuantity && oldQuantity &&
        newQuantity.field === oldQuantity.field && Math.abs(newQuantity.quantity - oldQuantity.quantity) < 0.000001) continue;
    if (newQuantity && (!item || ((item.unitType || 'kg') === 'kg' ? 'stockKg' : 'stockQuantity') !== newField)) {
      throw Object.assign(new Error(`Inventory item ${id} no longer matches the sale item.`), { status: 409 });
    }
    if (!item) {
      if (newQuantity) throw Object.assign(new Error(`Inventory item ${id} no longer exists.`), { status: 409 });
      continue;
    }

    for (const field of new Set([oldField, newField].filter(Boolean))) {
      const before = oldField === field ? oldQuantity.quantity : 0;
      const after = newField === field ? newQuantity.quantity : 0;
      const delta = after - before;
      if (Math.abs(delta) < 0.000001) continue;
      if (field === 'stockQuantity' && !Number.isInteger(delta)) {
        throw Object.assign(new Error(`Item ${item.name} must use a whole-number quantity.`), { status: 400 });
      }
      changes.push({ id, field, delta, name: item.name });
    }
  }

  const applied = [];
  try {
    for (const change of changes) {
      const result = await InventoryItem.updateOne(
        { id: change.id },
        { $inc: { [change.field]: -change.delta } }
      );
      if (!result.matchedCount) {
        throw Object.assign(new Error(`${change.name} stock changed while you were editing. Refresh and try again.`), { status: 409 });
      }
      applied.push(change);
    }
  } catch (error) {
    for (const change of applied.reverse()) {
      await InventoryItem.updateOne({ id: change.id }, { $inc: { [change.field]: change.delta } });
    }
    throw error;
  }
  return changes;
}

function adjustVaultInventorySnapshot(snapshot, quantities, restore) {
  (snapshot || []).forEach((row) => {
    const sold = quantities.get(String(row.id));
    if (!sold) return;
    const soldField = sold.field === 'stockKg' ? 'soldKg' : 'soldStock';
    const closingField = sold.field === 'stockKg' ? 'closingKg' : 'closingStock';
    const oldSold = Number(row.soldStock ?? row[soldField] ?? 0);
    const oldClosing = Number(row.closingStock ?? row[closingField] ?? 0);
    const oldSpecificSold = Number(row[soldField] ?? oldSold);
    const oldSpecificClosing = Number(row[closingField] ?? oldClosing);
    const adjustment = restore ? sold.quantity : -sold.quantity;
    row.soldStock = Math.max(0, oldSold + adjustment);
    row.closingStock = oldClosing - adjustment;
    if (sold.field === 'stockKg') {
      row.soldKg = Math.max(0, oldSpecificSold + adjustment);
      row.closingKg = oldSpecificClosing - adjustment;
    }
  });
}

async function updateSaleVaults(previous, updated, oldQuantities, newQuantities) {
  const dates = new Set([previous.date, updated.date]);
  for (const date of dates) {
    if (!validSaleDate(date)) continue;
    let vault = await DailyVault.findOne({ uid: date });
    if (!vault && date === updated.date) {
      vault = new DailyVault({ uid: date, date, posSales: [], inventorySnapshot: [] });
    }
    if (!vault) continue;
    const sales = vault.posSales || [];
    vault.posSales = sales.filter((entry) => String(entry.id) !== String(previous.id));
    if (date === updated.date) vault.posSales.push(updated.toObject ? clean(updated.toObject()) : updated);
    if (date === previous.date) adjustVaultInventorySnapshot(vault.inventorySnapshot, oldQuantities, true);
    if (date === updated.date) adjustVaultInventorySnapshot(vault.inventorySnapshot, newQuantities, false);
    await vault.save();
  }
}

async function refreshSaleCustomerTotals(phoneNumbers) {
  const keys = new Set(phoneNumbers.map(phoneKey).filter(Boolean));
  if (!keys.size) return;
  const sales = await PosSale.find().select('customer customerPhone totalRs date time').lean();
  const customers = await Customer.find().lean();
  const updatedKeys = new Set();
  for (const customer of customers) {
    const key = phoneKey(customer.phone);
    if (!keys.has(key)) continue;
    updatedKeys.add(key);
    const customerSales = sales.filter((sale) => phoneKey(sale.customerPhone) === key);
    customerSales.sort((a, b) => `${b.date || ''} ${b.time || ''}`.localeCompare(`${a.date || ''} ${a.time || ''}`));
    await Customer.updateOne({ _id: customer._id }, {
      $set: {
        visitCount: customerSales.length,
        totalSpent: customerSales.reduce((sum, sale) => sum + Number(sale.totalRs || 0), 0),
        lastVisit: customerSales[0]?.date || '',
        ...(customerSales[0] ? { name: customerSales[0].customer, phone: customerSales[0].customerPhone } : {})
      }
    });
  }
  for (const key of keys) {
    if (updatedKeys.has(key)) continue;
    const customerSales = sales.filter((sale) => phoneKey(sale.customerPhone) === key);
    if (!customerSales.length) continue;
    customerSales.sort((a, b) => `${b.date || ''} ${b.time || ''}`.localeCompare(`${a.date || ''} ${a.time || ''}`));
    await Customer.updateOne(
      { uid: key },
      {
        $setOnInsert: {
          uid: key,
          id: key,
          seq: Date.now(),
          name: customerSales[0].customer || 'Customer',
          phone: customerSales[0].customerPhone,
          loyaltyPoints: 0,
          loyaltyKgRemainder: 0
        },
        $set: {
          visitCount: customerSales.length,
          totalSpent: customerSales.reduce((sum, sale) => sum + Number(sale.totalRs || 0), 0),
          lastVisit: customerSales[0].date || '',
          name: customerSales[0].customer || 'Customer',
          phone: customerSales[0].customerPhone
        }
      },
      { upsert: true }
    );
  }
}

function phoneKey(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.startsWith('94') && digits.length === 11 ? `0${digits.slice(2)}` : digits;
}

async function nextDailyCustomerNumber(date) {
  const existingSales = await PosSale.countDocuments({ date });
  await DailyPosCounter.updateOne(
    { uid: date },
    { $setOnInsert: { uid: date, id: date, date, count: existingSales, seq: Date.now() } },
    { upsert: true }
  );
  const counter = await DailyPosCounter.findOneAndUpdate(
    { uid: date },
    { $inc: { count: 1 } },
    { new: true }
  );
  if (!counter) throw new Error(`Could not allocate a customer number for ${date}.`);
  return counter.count;
}

function saleTimeMinutes(time) {
  const match = String(time || '').match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return -1;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (match[3]) {
    hour %= 12;
    if (match[3].toUpperCase() === 'PM') hour += 12;
  }
  return hour * 60 + minute;
}

function compareSalesChronologically(left, right) {
  const dateOrder = String(left.date || '').localeCompare(String(right.date || ''));
  if (dateOrder) return dateOrder;
  const timeOrder = saleTimeMinutes(left.time) - saleTimeMinutes(right.time);
  if (timeOrder) return timeOrder;
  const createdOrder = String(left.createdAt || '').localeCompare(String(right.createdAt || ''));
  return createdOrder || String(left.id || '').localeCompare(String(right.id || ''));
}

async function refreshSaleCustomerLoyalty(phoneNumbers) {
  const keys = new Set(phoneNumbers.map(phoneKey).filter(Boolean));
  if (!keys.size) return;

  const sales = await PosSale.find()
    .select('id date time createdAt customerPhone itemsDetails loyaltyPointsEarned loyaltyPointsRedeemed loyaltyRedemptionPrinted')
    .lean();
  const customers = await Customer.find().lean();
  const saleUpdates = [];
  const customerUpdates = [];
  const recalculatedByDate = new Map();

  for (const key of keys) {
    let pointsBalance = 0;
    let kgRemainder = 0;
    const customerSales = sales.filter((sale) => phoneKey(sale.customerPhone) === key)
      .sort(compareSalesChronologically);

    for (const sale of customerSales) {
      const qualifyingKg = Array.isArray(sale.itemsDetails)
        ? sale.itemsDetails
          .filter((item) => item.unitType === 'kg' && !item.isLoyaltyFreeGiveaway)
          .reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0)
        : Math.max(0, Number(sale.loyaltyPointsEarned) || 0);
      const accumulatedKg = kgRemainder + qualifyingKg;
      const pointsEarned = Math.floor(accumulatedKg + 0.0000001);
      kgRemainder = +(accumulatedKg - pointsEarned).toFixed(4);
      pointsBalance += pointsEarned;

      const pointsRedeemed = Math.max(0, Number(sale.loyaltyPointsRedeemed) || 0);
      const balanceAfter = Math.max(0, pointsBalance - pointsRedeemed);
      if (sale.loyaltyRedemptionPrinted) pointsBalance = balanceAfter;

      const loyaltyUpdate = {
        loyaltyPointsEarned: pointsEarned,
        loyaltyPointsBalanceAfter: balanceAfter,
        loyaltyKgRemainderAfter: kgRemainder
      };
      saleUpdates.push({
        updateOne: {
          filter: { id: sale.id },
          update: { $set: loyaltyUpdate }
        }
      });
      if (!recalculatedByDate.has(sale.date)) recalculatedByDate.set(sale.date, new Map());
      recalculatedByDate.get(sale.date).set(String(sale.id), loyaltyUpdate);
    }

    customers.filter((entry) => phoneKey(entry.phone) === key).forEach((customer) => {
      customerUpdates.push({
        updateOne: {
          filter: { _id: customer._id },
          update: { $set: { loyaltyPoints: pointsBalance, loyaltyKgRemainder: kgRemainder } }
        }
      });
    });
  }

  if (saleUpdates.length) await PosSale.bulkWrite(saleUpdates);
  if (customerUpdates.length) await Customer.bulkWrite(customerUpdates);

  for (const [date, updates] of recalculatedByDate) {
    if (!date) continue;
    const vault = await DailyVault.findOne({ uid: date });
    if (!vault) continue;
    let changed = false;
    for (const sale of vault.posSales || []) {
      const loyaltyUpdate = updates.get(String(sale.id));
      if (!loyaltyUpdate) continue;
      Object.assign(sale, loyaltyUpdate);
      changed = true;
    }
    if (changed) await vault.save();
  }
}

// GET /api/state -> whole app state (same shape the old localStorage object had)
router.get('/', requireAuth, async (req, res) => {
  res.json(await buildState(req.user.role));
});

router.get('/pos-sales', requireAuth, async (req, res) => {
  if (req.user.role === 'farm') {
    return res.status(403).json({ error: 'Farm accounts cannot access POS sales' });
  }
  const sales = await PosSale.find()
    .sort({ createdAt: -1, _id: -1 })
    .select('-_id -__v -uid -seq -createdAt -updatedAt')
    .lean();
  res.json({ sales });
});

// PUT /api/state -> sync app state; staff inventory stock is changed only by stock additions and POS sales.
// ?replace=true (admin) makes the database exactly match the payload - used by "Restore Backup"
router.put('/', requireAuth, requireStateWriter, async (req, res) => {
  const body = req.body || {};
  const isAdmin = req.user.role === 'admin';
  const isFarmUser = req.user.role === 'farm';
  const replace = isAdmin && req.query.replace === 'true';
  const newlyCreatedSales = [];
  if (!isFarmUser && !replace && Array.isArray(body.posSales)) {
    const sales = body.posSales.filter((sale) => sale && sale.id !== undefined && sale.id !== null);
    const existingSales = await PosSale.find({ id: { $in: sales.map((sale) => String(sale.id)) } })
      .select('id')
      .lean();
    const existingIds = new Set(existingSales.map((sale) => String(sale.id)));
    for (const sale of sales) {
      if (existingIds.has(String(sale.id)) || !sale.date) continue;
      sale.dailyCustomerNumber = await nextDailyCustomerNumber(String(sale.date));
      const vaultSale = body.dailyVault?.[String(sale.date)]?.posSales?.find(
        (entry) => String(entry.id) === String(sale.id)
      );
      if (vaultSale) vaultSale.dailyCustomerNumber = sale.dailyCustomerNumber;
    }
  }
  for (const c of collections) {
    if (isFarmUser && !['farmIntakes', 'slaughterBatches'].includes(c.key)) continue;
    if (c.adminOnly && !isAdmin && !(isFarmUser && ['farmIntakes', 'slaughterBatches'].includes(c.key))) continue;
    if (c.key === 'cashierEntries' && !replace) continue;
    if (c.key === 'inventory' && !isAdmin) continue;
    const records = c.key === 'staff' ? (body.staff ?? body.employees) : body[c.key];
    if (!Array.isArray(records)) continue;
    const items = records
      .filter((x) => x && x[c.keyField] !== undefined && x[c.keyField] !== null)
      .map((item) => {
        if (c.key !== 'attendanceLogs' || item.staffId !== undefined || item.empId === undefined) return item;
        const { empId, ...rest } = item;
        return { ...rest, staffId: empId };
      });
    const result = await syncCollection(c, items, replace);
    if (!replace && c.key === 'posSales' && result?.upsertedIds) {
      Object.keys(result.upsertedIds).forEach((index) => {
        const sale = items[Number(index)];
        if (sale) newlyCreatedSales.push(sale);
      });
    }
  }
  if (newlyCreatedSales.length) await deductSoldInventory(newlyCreatedSales);
  if (!isFarmUser && body.dailyVault && typeof body.dailyVault === 'object') {
    const ops = Object.entries(body.dailyVault).map(([date, day]) => {
      const dailyRecord = { ...day, date, uid: date };
      if (!isAdmin) delete dailyRecord.inventoryAdjustments;
      return {
        updateOne: { filter: { uid: date }, update: { $set: dailyRecord }, upsert: true }
      };
    });
    if (ops.length) await DailyVault.bulkWrite(ops);
  }
  res.json({
    ok: true,
    savedAt: new Date().toISOString(),
    dailyCustomerNumbers: newlyCreatedSales.map((sale) => ({
      id: String(sale.id),
      dailyCustomerNumber: Number(sale.dailyCustomerNumber || 0)
    }))
  });
});

router.post('/inventory/adjustments', requireAuth, requireWriter, async (req, res) => {
  const itemId = String(req.body?.itemId || '');
  const direction = String(req.body?.direction || '');
  const quantityRaw = req.body?.quantity;
  const quantityInput = Number(quantityRaw);
  const reason = String(req.body?.reason || '').trim();
  const note = String(req.body?.note || '').trim();
  const validReasons = ['Spoilage', 'Trimming / waste', 'Stock-count correction', 'Other'];
  if (!itemId || !['INCREASE', 'DECREASE', 'COUNT'].includes(direction)) {
    return res.status(400).json({ error: 'Select a valid meat item and adjustment type.' });
  }
  if (typeof quantityRaw !== 'number' || !Number.isFinite(quantityInput) || quantityInput < 0 ||
      (direction !== 'COUNT' && quantityInput === 0)) {
    return res.status(400).json({ error: direction === 'COUNT'
      ? 'Enter a valid counted balance of zero or more.'
      : 'Enter an adjustment amount greater than zero.' });
  }
  const quantity = Math.round(quantityInput * 100) / 100;
  if (direction !== 'COUNT' && quantity <= 0) {
    return res.status(400).json({ error: 'Adjustment must be at least 0.01 kg.' });
  }
  if (!validReasons.includes(reason) || (reason === 'Other' && !note)) {
    return res.status(400).json({ error: reason === 'Other'
      ? 'Add a note when selecting Other as the reason.'
      : 'Select a valid reason for this adjustment.' });
  }
  if (note.length > 160) return res.status(400).json({ error: 'Adjustment notes must be 160 characters or fewer.' });

  const item = await InventoryItem.findOne({ id: itemId });
  if (!item) return res.status(404).json({ error: 'Inventory item not found.' });
  if ((item.unitType || 'kg') !== 'kg') {
    return res.status(400).json({ error: 'Stock adjustments are available for meat items measured in kilograms.' });
  }

  const now = new Date();
  const dateTimeParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now);
  const timePart = (type) => dateTimeParts.find((part) => part.type === type).value;
  const date = `${timePart('year')}-${timePart('month')}-${timePart('day')}`;
  const currentStock = Number(item.stockKg || 0);
  let delta = direction === 'DECREASE' ? -quantity : quantity;
  let newStock = +(currentStock + delta).toFixed(2);

  if (direction === 'COUNT') {
    const day = await DailyVault.findOne({ uid: date }).lean();
    const snapshot = day?.inventorySnapshot?.find((row) => String(row.id) === itemId);
    const adjustments = (day?.inventoryAdjustments || []).filter((entry) => String(entry.itemId) === itemId);
    const openingStock = Number(snapshot?.openingStock ?? snapshot?.openingKg);
    const addedStock = Number(snapshot?.addedStock ?? snapshot?.slaughterInKg);
    const soldStock = Number(snapshot?.soldStock ?? snapshot?.soldKg);
    const priorAdjustmentDelta = adjustments.reduce((total, entry) =>
      total + Number(entry.delta ?? ((entry.direction === 'DECREASE' ? -1 : 1) * Number(entry.quantity || 0))), 0);
    const expectedBeforeCount = [openingStock, addedStock, soldStock, priorAdjustmentDelta].every(Number.isFinite)
      ? openingStock + addedStock - soldStock + priorAdjustmentDelta
      : currentStock;
    delta = +(quantity - expectedBeforeCount).toFixed(2);
    newStock = quantity;
  }
  if (newStock < 0) {
    return res.status(400).json({ error: `Cannot reduce more than the available ${currentStock.toFixed(2)} kg.` });
  }

  const adjustment = {
    id: `inventory-adjustment-${randomUUID()}`,
    date,
    time: `${timePart('hour')}:${timePart('minute')}`,
    itemId: item.id,
    itemName: item.name,
    unitLabel: 'kg',
    direction: delta < 0 ? 'DECREASE' : delta > 0 ? 'INCREASE' : 'COUNT',
    mode: direction,
    delta,
    quantity: Math.abs(delta),
    ...(direction === 'COUNT' ? { countedStock: quantity } : {}),
    reason,
    note,
    recordedBy: String(req.user.label || req.user.username)
  };
  const stockFilter = { id: item.id, stockKg: currentStock };
  const updatedItem = await InventoryItem.findOneAndUpdate(
    stockFilter,
    { $set: { stockKg: newStock } },
    { new: true, runValidators: true }
  );
  if (!updatedItem) {
    return res.status(409).json({ error: 'Stock changed while recording this adjustment. Refresh and try again.' });
  }

  try {
    await DailyVault.findOneAndUpdate(
      { uid: date },
      { $setOnInsert: { uid: date, date, seq: Date.now() }, $push: { inventoryAdjustments: adjustment } },
      { upsert: true, new: true, runValidators: true }
    );
  } catch (error) {
    try {
      const rollback = await InventoryItem.updateOne(
        { id: item.id, stockKg: newStock },
        { $set: { stockKg: currentStock } }
      );
      if (rollback.modifiedCount !== 1) {
        throw new Error('Inventory changed before rollback could be applied.');
      }
    } catch (rollbackError) {
      console.error('Failed to roll back inventory after the stock adjustment audit record failed:', rollbackError);
      throw Object.assign(new Error('The adjustment audit could not be saved, and stock rollback failed. Contact an administrator.'), { status: 500 });
    }
    throw error;
  }

  res.status(201).json({ date, stockKg: updatedItem.stockKg, adjustment });
});

router.post('/cashier-entries', requireAuth, requireWriter, async (req, res) => {
  const { type } = req.body || {};
  const date = String(req.body?.date || '');
  const amount = Number(req.body?.amount);
  const takenBy = String(req.body?.takenBy || '').trim();
  const note = String(req.body?.note || '').trim();
  if (!['OPENING', 'WITHDRAWAL', 'EXTRA_CASH'].includes(type)) {
    return res.status(400).json({ error: 'Choose a valid cashier entry type.' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'A valid cashier date is required.' });
  }
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return res.status(400).json({ error: 'A valid cashier date is required.' });
  }
  if (date !== todayStr()) {
    return res.status(409).json({ error: 'Cashier entries can only be recorded for the current shop date.' });
  }
  if (!Number.isFinite(amount) || amount < 0 || (type !== 'OPENING' && amount === 0)) {
    return res.status(400).json({ error: type === 'OPENING'
      ? 'Enter a valid opening amount (zero or more).'
      : type === 'EXTRA_CASH' ? 'Enter an extra cash amount greater than zero.' : 'Enter a withdrawal amount greater than zero.' });
  }
  if (note.length > 500) {
    return res.status(400).json({ error: 'The cashier note must be 500 characters or fewer.' });
  }
  if (type === 'WITHDRAWAL' && !takenBy) {
    return res.status(400).json({ error: 'Enter the name of the person taking the cash.' });
  }
  if (type === 'EXTRA_CASH' && !note) {
    return res.status(400).json({ error: 'Enter a reason for the extra cash.' });
  }

  const dayEntries = await CashierEntry.find({ date }).lean();
  const opening = dayEntries.find((entry) => entry.type === 'OPENING');
  let previousDate = '';
  let previousClosingAmount;
  if (type === 'OPENING' && opening) {
    return res.status(409).json({ error: 'Today’s opening cash has already been recorded.' });
  }
  if (type === 'OPENING') {
    const previousDay = new Date(`${date}T00:00:00.000Z`);
    previousDay.setUTCDate(previousDay.getUTCDate() - 1);
    previousDate = previousDay.toISOString().slice(0, 10);
    const previousEntries = await CashierEntry.find({ date: previousDate }).lean();
    const previousOpening = previousEntries.find((entry) => entry.type === 'OPENING');
    if (previousOpening) {
      const [previousCashSales] = await PosSale.aggregate([
        { $match: { date: previousDate, payment: 'CASH' } },
        { $group: {
          _id: null,
          total: { $sum: '$totalRs' },
          extraCash: { $sum: { $ifNull: ['$extraCashKeptRs', 0] } }
        } }
      ]);
      const previousWithdrawals = previousEntries
        .filter((entry) => entry.type === 'WITHDRAWAL')
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      const previousManualExtraCash = previousEntries
        .filter((entry) => entry.type === 'EXTRA_CASH')
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      previousClosingAmount = Math.round((
        Number(previousOpening.amount || 0)
        + Number(previousCashSales?.total || 0)
        + Number(previousCashSales?.extraCash || 0)
        + previousManualExtraCash
        - previousWithdrawals
      ) * 100) / 100;
      if (Math.round(amount * 100) !== Math.round(previousClosingAmount * 100)) {
        if (!note) {
          return res.status(400).json({
            error: `Counted opening cash differs from ${previousDate} closing cash (Rs. ${previousClosingAmount.toLocaleString()}). Enter a reason to continue.`
          });
        }
      }
    } else {
      previousDate = '';
    }
  }
  if (type === 'WITHDRAWAL') {
    if (!opening) return res.status(409).json({ error: 'Record the day’s opening cash before recording a withdrawal.' });
    const [cashSales] = await PosSale.aggregate([
      { $match: { date, payment: 'CASH' } },
      { $group: {
        _id: null,
        total: { $sum: '$totalRs' },
        extraCash: { $sum: { $ifNull: ['$extraCashKeptRs', 0] } }
      } }
    ]);
    const manualExtraCash = dayEntries
      .filter((entry) => entry.type === 'EXTRA_CASH')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const available = Number(opening.amount || 0)
      + Number(cashSales?.total || 0)
      + Number(cashSales?.extraCash || 0)
      + manualExtraCash
      - dayEntries.filter((entry) => entry.type === 'WITHDRAWAL')
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    if (amount > available) {
      return res.status(409).json({ error: `Withdrawal exceeds the available drawer balance of Rs. ${available.toLocaleString()}.` });
    }
  }

  const id = type === 'OPENING' ? `opening-${date}` : `${type.toLowerCase()}-${randomUUID()}`;
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
    note,
    previousDate: type === 'OPENING' ? previousDate : '',
    previousClosingAmount: type === 'OPENING' ? previousClosingAmount : undefined
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

router.put('/cashier-entries/:id', requireAuth, requireWriter, async (req, res) => {
  const entry = await CashierEntry.findOne({ id: req.params.id });
  if (!entry || entry.type !== 'EXTRA_CASH') {
    return res.status(404).json({ error: 'Extra-cash entry not found.' });
  }
  if (entry.date !== todayStr() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only an admin can edit historical extra-cash entries.' });
  }
  const amount = Number(req.body?.amount);
  const note = String(req.body?.note || '').trim();
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Enter an extra cash amount greater than zero.' });
  }
  if (!note || note.length > 500) {
    return res.status(400).json({ error: 'Enter a reason of 500 characters or fewer.' });
  }
  const updated = await CashierEntry.findOneAndUpdate(
    { _id: entry._id, updatedAt: entry.updatedAt },
    { $set: { amount: Math.round(amount * 100) / 100, note, recordedBy: String(req.user.label || req.user.username) } },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(409).json({ error: 'Cashier entry changed while you were editing it. Refresh and try again.' });
  res.json({ entry: clean(updated.toObject()) });
});

router.put('/pos-sales/:id', requireAuth, requireAdmin, async (req, res) => {
  const sale = await PosSale.findOne({ id: req.params.id });
  if (!sale) return res.status(404).json({ error: 'POS sale not found' });

  const body = req.body || {};
  const validPayments = ['CASH', 'CARD', 'QR / TRANSFER', 'CREDIT'];
  const time = String(body.time || '').trim();
  const timeMatch = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!validSaleDate(String(body.date || '')) || !timeMatch || Number(timeMatch[1]) > (timeMatch[4] ? 12 : 23) ||
      Number(timeMatch[1]) < (timeMatch[4] ? 1 : 0) || Number(timeMatch[2]) > 59 ||
      Number(timeMatch[3] || 0) > 59) {
    return res.status(400).json({ error: 'Enter a valid sale date and time.' });
  }
  const customer = String(body.customer || '').trim();
  const customerPhone = String(body.customerPhone || '').trim();
  const payment = String(body.payment || '');
  if (!customer || customer.length > 160 || customerPhone.length > 40 || !validPayments.includes(payment)) {
    return res.status(400).json({ error: 'Enter a valid customer, phone number, and payment method.' });
  }
  const extraCashKeptRs = body.extraCashKeptRs === undefined ? 0 : body.extraCashKeptRs;
  const extraCashReason = String(body.extraCashReason || '').trim();
  const numericFields = ['subtotal', 'discount', 'totalRs', 'cashReceivedRs', 'changeRs', 'deliveryFeeRs'];
  if (numericFields.some((field) => typeof body[field] !== 'number' || !Number.isFinite(body[field]) || body[field] < 0)) {
    return res.status(400).json({ error: 'Sale amounts must be valid non-negative numbers.' });
  }
  if (typeof extraCashKeptRs !== 'number' || !Number.isFinite(extraCashKeptRs) || extraCashKeptRs < 0 ||
      extraCashReason.length > 500 || (extraCashKeptRs > 0 && !extraCashReason)) {
    return res.status(400).json({ error: 'Enter a valid extra cash amount and a reason when extra cash is kept.' });
  }
  if (typeof body.delivery !== 'boolean') {
    return res.status(400).json({ error: 'Select whether this sale used delivery.' });
  }
  if (payment === 'CASH' && Math.abs(body.cashReceivedRs - body.totalRs - body.changeRs - extraCashKeptRs) > 0.01) {
    return res.status(400).json({ error: 'Cash received must equal the sale total, extra cash kept, and change returned.' });
  }
  if (payment !== 'CASH' && (body.cashReceivedRs !== 0 || body.changeRs !== 0 || extraCashKeptRs !== 0 || extraCashReason)) {
    return res.status(400).json({ error: 'Cash received, change, and extra cash kept must be zero for non-cash payments.' });
  }
  if (!Array.isArray(body.itemsDetails) || body.itemsDetails.length < 1 || body.itemsDetails.length > 100) {
    return res.status(400).json({ error: 'A sale must contain between 1 and 100 items.' });
  }

  const itemsDetails = [];
  for (const detail of body.itemsDetails) {
    const quantity = Number(detail?.quantity);
    const unitPrice = Number(detail?.unitPrice);
    const lineTotal = Number(detail?.lineTotal);
    const id = String(detail?.id || '');
    const unitType = String(detail?.unitType || '');
    const name = String(detail?.name || '').trim();
    if (!id || !name || name.length > 160 || !['kg', 'packet', 'unit'].includes(unitType) ||
        !Number.isFinite(quantity) || quantity <= 0 || (unitType !== 'kg' && !Number.isInteger(quantity)) ||
        !Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(lineTotal) || lineTotal < 0) {
      return res.status(400).json({ error: 'Check the product, quantity, unit price, and line total for every item.' });
    }
    itemsDetails.push({
      id, name, unitType, quantity, unitLabel: String(detail.unitLabel || unitType),
      unitPrice, lineTotal, weightKg: unitType === 'kg' ? quantity : 0,
      ...(Number.isFinite(Number(detail.packWeightGrams)) && Number(detail.packWeightGrams) > 0
        ? { packWeightGrams: Number(detail.packWeightGrams) } : {}),
      ...(detail.isPieces === true ? { isPieces: true } : {}),
      ...(detail.isLoyaltyFreeGiveaway === true ? { isLoyaltyFreeGiveaway: true } : {})
    });
  }
  const newQuantities = getEditedSaleInventoryQuantities(itemsDetails);
  if (!newQuantities) return res.status(400).json({ error: 'Sale item quantities or units are invalid.' });

  const linkedReceivable = await Receivable.findOne({ id: sale.id });
  if (linkedReceivable?.status === 'Collected') {
    return res.status(409).json({ error: 'This sale is linked to a collected credit. Collected credit sales cannot be edited.' });
  }

  const oldQuantities = getSaleInventoryQuantities(sale);
  const totalKg = +itemsDetails.filter((item) => item.unitType === 'kg')
    .reduce((sum, item) => sum + item.quantity, 0).toFixed(2);
  const itemsBreakdown = {};
  itemsDetails.forEach((item) => {
    if (item.unitType === 'kg') itemsBreakdown[item.id] = (itemsBreakdown[item.id] || 0) + item.quantity;
  });
  const itemsSummary = itemsDetails.map((item) =>
    `${item.name}${item.isPieces ? ' — Pieces' : ''} (${item.quantity} ${item.unitLabel}${item.quantity === 1 ? '' : 's'})`
  ).join(', ');
  const updatedDate = String(body.date);
  const dailyCustomerNumber = updatedDate !== sale.date
    ? await nextDailyCustomerNumber(updatedDate)
    : undefined;
  const loyaltyReset = phoneKey(customerPhone) ? {} : {
    loyaltyPointsEarned: 0,
    loyaltyPointsRedeemed: 0,
    loyaltyPointsBalanceAfter: 0,
    loyaltyKgRemainderAfter: 0
  };
  const updates = {
    date: updatedDate,
    time,
    customer,
    customerPhone,
    payment,
    subtotal: body.subtotal,
    discount: body.discount,
    totalRs: body.totalRs,
    cashReceivedRs: payment === 'CASH' ? body.cashReceivedRs : 0,
    changeRs: payment === 'CASH' ? body.changeRs : 0,
    extraCashKeptRs: payment === 'CASH' ? extraCashKeptRs : 0,
    extraCashReason: payment === 'CASH' ? extraCashReason : '',
    delivery: body.delivery,
    deliveryFeeRs: body.delivery ? body.deliveryFeeRs : 0,
    itemsDetails,
    itemsBreakdown,
    itemsSummary,
    totalKg,
    ...loyaltyReset,
    ...(dailyCustomerNumber !== undefined ? { dailyCustomerNumber } : {})
  };
  let inventoryChanges = [];
  let updatedSale;
  try {
    inventoryChanges = await applySaleInventoryDelta(oldQuantities, newQuantities);
    updatedSale = await PosSale.findOneAndUpdate(
      { _id: sale._id, updatedAt: sale.updatedAt },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedSale) {
      throw Object.assign(new Error('POS sale changed while you were editing it. Refresh and try again.'), { status: 409 });
    }
  } catch (error) {
    for (const change of inventoryChanges.reverse()) {
      await InventoryItem.updateOne({ id: change.id }, { $inc: { [change.field]: change.delta } });
    }
    throw error;
  }

  if (payment === 'CREDIT') {
    await Receivable.findOneAndUpdate(
      { id: sale.id },
      {
        $set: {
          date: updates.date,
          customer,
          phone: customerPhone,
          details: `${itemsSummary}${updates.delivery ? ` • Delivery fee Rs. ${Number(updates.deliveryFeeRs).toLocaleString()}` : ''}`,
          amount: updates.totalRs
        },
        $setOnInsert: { uid: String(sale.id), id: String(sale.id), status: 'Pending' }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else {
    await Receivable.deleteOne({ id: sale.id });
  }

  await updateSaleVaults(sale, updatedSale, oldQuantities, newQuantities);
  await refreshSaleCustomerTotals([sale.customerPhone, customerPhone]);
  await refreshSaleCustomerLoyalty([sale.customerPhone, customerPhone]);
  res.json({ sale: clean(updatedSale.toObject()) });
});

router.patch('/pos-sales/:id/payment', requireAuth, requireAdmin, async (req, res) => {
  const payment = String(req.body?.payment || '');
  const validPayments = ['CASH', 'CARD', 'QR / TRANSFER', 'CREDIT'];
  if (!validPayments.includes(payment)) {
    return res.status(400).json({ error: 'Select a valid POS payment method.' });
  }

  const sale = await PosSale.findOne({ id: req.params.id });
  if (!sale) return res.status(404).json({ error: 'POS sale not found' });

  const linkedReceivable = await Receivable.findOne({ id: sale.id });
  if (sale.payment === 'CREDIT' && payment !== 'CREDIT' && linkedReceivable?.status === 'Collected') {
    return res.status(409).json({ error: 'This credit sale has already been marked as collected and its payment method cannot be changed.' });
  }

  const updatedSale = await PosSale.findOneAndUpdate(
    { _id: sale._id, payment: sale.payment },
    {
      $set: {
        payment,
        cashReceivedRs: payment === 'CASH'
          ? sale.payment === 'CASH' ? Number(sale.cashReceivedRs ?? sale.totalRs ?? 0) : Number(sale.totalRs || 0)
          : 0,
        changeRs: payment === 'CASH' && sale.payment === 'CASH' ? Number(sale.changeRs || 0) : 0,
        extraCashKeptRs: payment === 'CASH' && sale.payment === 'CASH' ? Number(sale.extraCashKeptRs || 0) : 0,
        extraCashReason: payment === 'CASH' && sale.payment === 'CASH' ? String(sale.extraCashReason || '') : ''
      }
    },
    { new: true, runValidators: true }
  );
  if (!updatedSale) return res.status(409).json({ error: 'POS sale changed while you were editing it. Refresh and try again.' });

  let receivable = null;
  if (payment === 'CREDIT') {
    receivable = await Receivable.findOneAndUpdate(
      { id: sale.id },
      {
        $setOnInsert: {
          uid: String(sale.id),
          id: String(sale.id),
          date: sale.date,
          customer: sale.customer,
          phone: sale.customerPhone,
          details: `${sale.itemsSummary}${sale.delivery ? ` • Delivery fee Rs. ${Number(sale.deliveryFeeRs || 0).toLocaleString()}` : ''}`,
          amount: Number(sale.totalRs || 0),
          status: 'Pending'
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else {
    await Receivable.deleteOne({ id: sale.id });
  }

  const vault = await DailyVault.findOne({ uid: sale.date });
  if (vault) {
    const vaultSale = (vault.posSales || []).find((entry) => String(entry.id) === String(sale.id));
    if (vaultSale) {
      vaultSale.payment = updatedSale.payment;
      vaultSale.cashReceivedRs = updatedSale.cashReceivedRs;
      vaultSale.changeRs = updatedSale.changeRs;
      vaultSale.extraCashKeptRs = updatedSale.extraCashKeptRs;
      vaultSale.extraCashReason = updatedSale.extraCashReason;
      await vault.save();
    }
  }

  res.json({
    sale: clean(updatedSale.toObject()),
    receivable: receivable ? clean(receivable.toObject()) : null
  });
});

router.delete('/pos-sales/:id', requireAuth, requireAdmin, async (req, res) => {
  const sale = await PosSale.findOne({ id: req.params.id });
  if (!sale) return res.status(404).json({ error: 'POS sale not found' });

  const quantities = getSaleInventoryQuantities(sale);
  const itemIds = [...quantities.keys()];
  if (itemIds.length) {
    const inventory = await InventoryItem.find({ id: { $in: itemIds } }).select('id').lean();
    if (inventory.length !== itemIds.length) {
      return res.status(409).json({ error: 'Cannot delete this sale because a sold inventory item no longer exists.' });
    }

    await InventoryItem.bulkWrite([...quantities].map(([id, { field, quantity }]) => ({
      updateOne: { filter: { id }, update: { $inc: { [field]: quantity } } }
    })));
  }

  try {
    const deletedSale = await PosSale.findOneAndDelete({ _id: sale._id });
    if (!deletedSale) {
      if (itemIds.length) {
        await InventoryItem.bulkWrite([...quantities].map(([id, { field, quantity }]) => ({
          updateOne: { filter: { id }, update: { $inc: { [field]: -quantity } } }
        })));
      }
      return res.status(404).json({ error: 'POS sale was already removed' });
    }
  } catch (error) {
    if (itemIds.length) {
      try {
        await InventoryItem.bulkWrite([...quantities].map(([id, { field, quantity }]) => ({
          updateOne: { filter: { id }, update: { $inc: { [field]: -quantity } } }
        })));
      } catch (rollbackError) {
        console.error('Failed to roll back inventory after POS sale deletion failed:', rollbackError);
        throw Object.assign(new Error('Sale deletion failed and inventory rollback could not be completed.'), { status: 500 });
      }
    }
    throw error;
  }

  await Receivable.deleteOne({ id: sale.id });

  const vault = await DailyVault.findOne({ uid: sale.date });
  if (vault) {
    vault.posSales = (vault.posSales || []).filter((entry) => String(entry.id) !== String(sale.id));
    (vault.inventorySnapshot || []).forEach((row) => {
      const sold = quantities.get(String(row.id));
      if (!sold) return;
      const oldSoldStock = Number(row.soldStock ?? row.soldKg ?? 0);
      const oldClosingStock = Number(row.closingStock ?? row.closingKg ?? 0);
      row.soldStock = Math.max(0, oldSoldStock - sold.quantity);
      row.closingStock = oldClosingStock + sold.quantity;
      if (sold.field === 'stockKg') {
        row.soldKg = Math.max(0, Number(row.soldKg ?? oldSoldStock) - sold.quantity);
        row.closingKg = Number(row.closingKg ?? oldClosingStock) + sold.quantity;
      }
    });
    await vault.save();
  }

  await refreshSaleCustomerTotals([sale.customerPhone]);
  await refreshSaleCustomerLoyalty([sale.customerPhone]);
  res.json({ ok: true, deletedSale: clean(sale.toObject()), restoredInventoryItems: itemIds.length });
});

router.get('/inventory/stock-additions', requireAuth, async (req, res) => {
  if (req.user.role === 'farm') {
    return res.status(403).json({ error: 'Farm accounts cannot access inventory stock additions' });
  }
  const date = String(req.query.date || '');
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return res.status(400).json({ error: 'A valid inventory summary date is required.' });
  }

  const additions = await InventoryStockAddition.find({ date })
    .sort({ addedAt: 1, _id: 1 })
    .select('-_id -__v -createdAt -updatedAt')
    .lean();
  res.json({ date, additions });
});

router.put('/inventory/:id', requireAuth, requireAdmin, async (req, res) => {
  const item = await InventoryItem.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ error: 'Inventory item not found.' });

  const unitType = item.unitType || 'kg';
  const stockField = unitType === 'kg' ? 'stockKg' : 'stockQuantity';
  const priceField = unitType === 'kg' ? 'pricePerKg' : 'pricePerUnit';
  const expectedStock = req.body?.expectedStock;
  const stock = req.body?.[stockField];
  const price = req.body?.[priceField];
  const name = String(req.body?.name || '').trim();
  const source = String(req.body?.source || '').trim();
  const wholesalePrice = Number(req.body?.wholesalePrice);
  if (typeof expectedStock !== 'number' || !Number.isFinite(expectedStock) ||
      typeof stock !== 'number' || !Number.isFinite(stock) || stock < 0 ||
      (unitType !== 'kg' && !Number.isInteger(stock)) ||
      typeof price !== 'number' || !Number.isFinite(price) || price <= 0 ||
      !name || name.length > 160 || !source || source.length > 160 ||
      !Number.isFinite(wholesalePrice) || wholesalePrice < 0) {
    return res.status(400).json({ error: 'Enter valid item details, prices, and a non-negative stock balance.' });
  }

  const updated = await InventoryItem.findOneAndUpdate(
    { id: item.id, [stockField]: expectedStock },
    { $set: { name, source, wholesalePrice, [priceField]: price, [stockField]: stock } },
    { new: true, runValidators: true }
  );
  if (!updated) {
    return res.status(409).json({ error: 'Inventory stock changed while you were editing it. Refresh and try again.' });
  }
  res.json({ item: clean(updated.toObject()) });
});

router.post('/inventory/:id/stock', requireAuth, requireWriter, async (req, res) => {
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
  const addedAt = new Date();
  const updated = await InventoryItem.findOneAndUpdate(
    { id: req.params.id },
    { $inc: { [stockField]: quantity } },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: 'Inventory item not found' });
  const dateTimeParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(addedAt);
  const timePart = (type) => dateTimeParts.find((part) => part.type === type).value;
  const date = `${timePart('year')}-${timePart('month')}-${timePart('day')}`;
  const unitLabel = unitType === 'kg' ? 'kg'
    : unitType === 'packet' ? `${Number(item.packWeightGrams || 0)}g packet` : (item.unitLabel || 'unit');
  const additionId = randomUUID();
  try {
    await InventoryStockAddition.create({
      id: additionId,
      uid: additionId,
      date,
      time: `${timePart('hour')}:${timePart('minute')}:${timePart('second')}`,
      addedAt,
      itemId: item.id,
      itemName: item.name,
      source: item.source || '',
      quantity,
      unitLabel,
      addedBy: String(req.user.label || req.user.username)
    });
  } catch (error) {
    try {
      await InventoryItem.updateOne({ id: item.id }, { $inc: { [stockField]: -quantity } });
    } catch (rollbackError) {
      console.error('Failed to roll back inventory stock after its addition audit record failed:', rollbackError);
      throw Object.assign(new Error('Stock was added but its audit record could not be saved, and stock rollback failed.'), { status: 500 });
    }
    throw error;
  }
  res.json({ id: updated.id, stockKg: updated.stockKg, stockQuantity: updated.stockQuantity });
});

module.exports = router;
