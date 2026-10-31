const router = require('express').Router();
const { Staff, AttendanceLog } = require('../models');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { todayStr, timeStr } = require('../utils/time');

async function signOut(staff, method, requireActiveShift = false) {
  const now = new Date();
  const nowStr = timeStr(now);
  const stamp = method === 'Wall QR Mobile' ? `${nowStr} (Wall QR)` : nowStr;

  const log = await AttendanceLog.findOne({ staffId: staff.id, signOut: 'Active Shift' }).sort({ signInAt: -1 });
  if (!log && requireActiveShift) return null;
  let hours = 0, ot = 0;
  if (log) {
    hours = log.signInAt ? +((now - log.signInAt) / 36e5).toFixed(2) : 10;  // seeded logs have no timestamp
    ot = +Math.max(0, hours - 10).toFixed(2);   // standard shift = 10h, extra = overtime
    log.signOut = stamp; log.hours = hours; log.ot = ot;
    await log.save();
  }
  staff.clockedIn = false;
  await staff.save();
  return { action: 'OUT', time: nowStr, hours, ot, message: `${staff.name} signed OUT at ${nowStr} (${hours} hrs, ${ot} OT)` };
}

async function toggleClock(staff, method) {
  if (staff.clockedIn) return signOut(staff, method);

  const now = new Date();
  const nowStr = timeStr(now);
  const stamp = method === 'Wall QR Mobile' ? `${nowStr} (Wall QR)` : nowStr;
  const id = Date.now();
  await AttendanceLog.create({
    uid: String(id), id, staffId: staff.id, date: todayStr(now), signIn: stamp,
    signOut: 'Active Shift', hours: 0, ot: 0, signInAt: now, seq: -1
  });
  staff.clockedIn = true; staff.lastClockIn = nowStr;
  await staff.save();
  return { action: 'IN', time: nowStr, message: `${staff.name} signed IN at ${nowStr}` };
}

// PUBLIC - used by the mobile wall-QR page (PINs are never exposed)
router.get('/roster', async (req, res) => {
  const rows = await Staff.find({ archivedAt: null }).sort({ seq: 1 }).lean();
  res.json(rows.map((e) => ({ id: e.id, name: e.name, role: e.role, clockedIn: !!e.clockedIn, lastClockIn: e.lastClockIn })));
});

// PUBLIC - staff scans wall QR, picks name, types PIN
router.post('/qr-clock', async (req, res) => {
  const staffId = Number(req.body.staffId ?? req.body.empId);
  const staff = await Staff.findOne({ id: staffId });
  if (!staff || staff.archivedAt) return res.status(404).json({ error: 'Active staff member not found' });
  if (String(req.body.pin || '') !== String(staff.pin)) return res.status(401).json({ error: 'Incorrect 4-digit PIN' });
  res.json(await toggleClock(staff, 'Wall QR Mobile'));
});

// ADMIN - kiosk buttons (no PIN needed)
router.post('/clock', requireAuth, requireAdmin, async (req, res) => {
  const staffId = Number(req.body.staffId ?? req.body.empId);
  const staff = await Staff.findOne({ id: staffId });
  if (!staff || staff.archivedAt) return res.status(404).json({ error: 'Active staff member not found' });
  res.json(await toggleClock(staff, 'Kiosk'));
});

router.post('/manual-sign-out', requireAuth, requireAdmin, async (req, res) => {
  const staffId = Number(req.body.staffId ?? req.body.empId);
  const staff = await Staff.findOne({ id: staffId });
  if (!staff || staff.archivedAt) return res.status(404).json({ error: 'Active staff member not found' });
  if (!staff.clockedIn) return res.status(409).json({ error: 'Staff member is not clocked in' });
  const result = await signOut(staff, 'Kiosk', true);
  if (!result) return res.status(409).json({ error: 'No active shift found for this staff member' });
  res.json(result);
});

module.exports = router;
