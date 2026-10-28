const router = require('express').Router();
const { Employee, AttendanceLog } = require('../models');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { todayStr, timeStr } = require('../utils/time');

async function signOut(emp, method, requireActiveShift = false) {
  const now = new Date();
  const nowStr = timeStr(now);
  const stamp = method === 'Wall QR Mobile' ? `${nowStr} (Wall QR)` : nowStr;

  const log = await AttendanceLog.findOne({ empId: emp.id, signOut: 'Active Shift' }).sort({ signInAt: -1 });
  if (!log && requireActiveShift) return null;
  let hours = 0, ot = 0;
  if (log) {
    hours = log.signInAt ? +((now - log.signInAt) / 36e5).toFixed(2) : 10;  // seeded logs have no timestamp
    ot = +Math.max(0, hours - 10).toFixed(2);   // standard shift = 10h, extra = overtime
    log.signOut = stamp; log.hours = hours; log.ot = ot;
    await log.save();
  }
  emp.clockedIn = false;
  await emp.save();
  return { action: 'OUT', time: nowStr, hours, ot, message: `${emp.name} signed OUT at ${nowStr} (${hours} hrs, ${ot} OT)` };
}

async function toggleClock(emp, method) {
  if (emp.clockedIn) return signOut(emp, method);

  const now = new Date();
  const nowStr = timeStr(now);
  const stamp = method === 'Wall QR Mobile' ? `${nowStr} (Wall QR)` : nowStr;
  const id = Date.now();
  await AttendanceLog.create({
    uid: String(id), id, empId: emp.id, date: todayStr(now), signIn: stamp,
    signOut: 'Active Shift', hours: 0, ot: 0, signInAt: now, seq: -1
  });
  emp.clockedIn = true; emp.lastClockIn = nowStr;
  await emp.save();
  return { action: 'IN', time: nowStr, message: `${emp.name} signed IN at ${nowStr}` };
}

// PUBLIC - used by the mobile wall-QR page (PINs are never exposed)
router.get('/roster', async (req, res) => {
  const rows = await Employee.find({ archivedAt: null }).sort({ seq: 1 }).lean();
  res.json(rows.map((e) => ({ id: e.id, name: e.name, role: e.role, clockedIn: !!e.clockedIn, lastClockIn: e.lastClockIn })));
});

// PUBLIC - staff scans wall QR, picks name, types PIN
router.post('/qr-clock', async (req, res) => {
  const emp = await Employee.findOne({ id: Number(req.body.empId) });
  if (!emp || emp.archivedAt) return res.status(404).json({ error: 'Active employee not found' });
  if (String(req.body.pin || '') !== String(emp.pin)) return res.status(401).json({ error: 'Incorrect 4-digit PIN' });
  res.json(await toggleClock(emp, 'Wall QR Mobile'));
});

// ADMIN - kiosk buttons (no PIN needed)
router.post('/clock', requireAuth, requireAdmin, async (req, res) => {
  const emp = await Employee.findOne({ id: Number(req.body.empId) });
  if (!emp || emp.archivedAt) return res.status(404).json({ error: 'Active employee not found' });
  res.json(await toggleClock(emp, 'Kiosk'));
});

router.post('/manual-sign-out', requireAuth, requireAdmin, async (req, res) => {
  const emp = await Employee.findOne({ id: Number(req.body.empId) });
  if (!emp || emp.archivedAt) return res.status(404).json({ error: 'Active employee not found' });
  if (!emp.clockedIn) return res.status(409).json({ error: 'Employee is not clocked in' });
  const result = await signOut(emp, 'Kiosk', true);
  if (!result) return res.status(409).json({ error: 'No active shift found for this employee' });
  res.json(result);
});

module.exports = router;
