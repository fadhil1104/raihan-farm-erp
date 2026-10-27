/**
 * MongoDB collections for Raihan Farm Shop ERP.
 *
 * Every business record keeps the exact shape the frontend uses (strict:false) and is
 * identified by `uid` (string form of the record's natural key) and ordered by `seq`.
 */
const { Schema, model } = require('mongoose');

const opts = { strict: false, timestamps: true };
const base = { uid: { type: String, required: true, unique: true, index: true }, seq: { type: Number, default: 0 } };

const InventoryItem = model('InventoryItem', new Schema({
  ...base, id: String, name: String, source: String, unitType: { type: String, enum: ['kg', 'packet', 'unit'], default: 'kg' },
  stockKg: { type: Number, default: 0 }, pricePerKg: { type: Number, default: 0 },
  minStockKg: { type: Number, default: 0 }, stockQuantity: { type: Number, default: 0 },
  pricePerUnit: { type: Number, default: 0 }, minStockQuantity: { type: Number, default: 0 },
  packWeightGrams: Number, wholesalePrice: { type: Number, default: 0 }, staffEditCount: { type: Number, default: 0 }
}, opts));

const InventoryApproval = model('InventoryApproval', new Schema({
  ...base, reqId: String, itemId: String, itemName: String, requestedBy: String, time: String,
  oldPrice: Number, newPrice: Number, oldStock: Number, newStock: Number, reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, opts));

const Customer = model('Customer', new Schema({
  ...base, id: String, name: String, phone: String, visitCount: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 }, lastVisit: String
}, opts));

const SlaughterBatch = model('SlaughterBatch', new Schema({
  ...base, id: String, date: String, source: String, categoryId: String, categoryName: String,
  count: Number, liveKg: Number, expectedKg: Number, actualKg: Number, wasteKg: Number, wastePct: Number
}, opts));

const PosSale = model('PosSale', new Schema({
  ...base, id: String, date: String, time: String, customer: String, customerPhone: String, itemsSummary: String,
  itemsBreakdown: Schema.Types.Mixed, itemsDetails: [Schema.Types.Mixed], totalKg: Number, payment: String, totalRs: Number
}, opts));

const Employee = model('Employee', new Schema({
  ...base, id: Number, name: String, phone: String, role: String, pin: String, baseSalary: Number, otRate: Number,
  allowance: Number, advance: Number, clockedIn: Boolean, lastClockIn: String, archivedAt: Date
}, opts));

const AttendanceLog = model('AttendanceLog', new Schema({
  ...base, id: Number, empId: Number, date: String, signIn: String, signOut: String,
  hours: Number, ot: Number, signInAt: Date
}, opts));

const Delivery = model('Delivery', new Schema({
  ...base, id: Number, customer: String, phone: String, area: String, items: String,
  date: String, slot: String, rider: String, status: String
}, opts));

const Subscription = model('Subscription', new Schema({
  ...base, id: Number, customer: String, phone: String, area: String, pack: String,
  day: String, price: Number, status: String
}, opts));

const Receivable = model('Receivable', new Schema({
  ...base, id: String, date: String, customer: String, phone: String, details: String,
  amount: Number, status: { type: String, enum: ['Pending', 'Collected'], default: 'Pending' }
}, opts));

const MonthlyHistory = model('MonthlyHistory', new Schema({
  ...base, month: String, year: String, kgSold: Number, posCashSales: Number,
  subBulkSales: Number, receivables: Number, expenses: Number
}, opts));

const WeeklyHistory = model('WeeklyHistory', new Schema({
  ...base, week: String, year: String, kgSold: Number, posCashSales: Number,
  subBulkSales: Number, receivables: Number, expenses: Number
}, opts));

// One document per calendar day. Permanent archive - never deleted by state sync.
const DailyVault = model('DailyVault', new Schema({
  ...base, date: String, posSales: [Schema.Types.Mixed], slaughterBatches: [Schema.Types.Mixed],
  inventorySnapshot: [Schema.Types.Mixed]
}, opts));

/**
 * Maps the frontend `state` keys -> Mongo models.
 * keyField: natural key inside each record. adminOnly: staff role may not write it.
 */
const collections = [
  { key: 'inventory',                 Model: InventoryItem,     keyField: 'id' },
  { key: 'pendingInventoryApprovals', Model: InventoryApproval, keyField: 'reqId' },
  { key: 'customers',                 Model: Customer,          keyField: 'id' },
  { key: 'slaughterBatches',          Model: SlaughterBatch,    keyField: 'id',    adminOnly: true, sortNewest: true },
  { key: 'posSales',                  Model: PosSale,           keyField: 'id',    insertOnly: true, sortNewest: true },
  { key: 'receivablesList',           Model: Receivable,        keyField: 'id' },
  { key: 'yearlyHistory',             Model: MonthlyHistory,    keyField: 'month' },
  { key: 'weeklyHistory',             Model: WeeklyHistory,     keyField: 'week' },
  // clockedIn / lastClockIn are owned by the server (QR + kiosk endpoints) and never overwritten by a browser sync
  { key: 'employees',                 Model: Employee,          keyField: 'id',    adminOnly: true, protect: ['clockedIn', 'lastClockIn'] },
  { key: 'attendanceLogs',            Model: AttendanceLog,     keyField: 'id',    adminOnly: true, insertOnly: true, sortNewest: true },
  { key: 'deliveries',                Model: Delivery,          keyField: 'id' },
  { key: 'subscriptions',             Model: Subscription,     keyField: 'id' }
];

/*
 * Flags
 *  adminOnly  - staff role may not write this collection
 *  insertOnly - existing records are never modified/overwritten by a sync (sales and logs are immutable once saved)
 *  protect    - fields that a sync may only set when a record is first created
 *  sortNewest - returned newest first (otherwise in saved order via `seq`)
 * A normal sync only inserts/updates; records are deleted only by an admin restore (PUT /api/state?replace=true).
 */

module.exports = { collections, DailyVault, InventoryItem, Employee, AttendanceLog, PosSale, Customer };
