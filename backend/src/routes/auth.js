const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { Staff } = require('../models');
const { signToken, requireAuth, requireAdmin } = require('../middleware/auth');

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function validPhone(phone) {
  return /^\d{7,15}$/.test(phone);
}

// POST /api/auth/login  { username, password }
router.post('/login', async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  let user = await User.findOne({ username });
  if (!user) {
    const phone = normalizePhone(username);
    if (validPhone(phone)) user = await User.findOne({ username: phone });
  }
  if (!user || user.isActive === false || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: signToken(user), user: { username: user.username, role: user.role, label: user.label } });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const { username, role, label } = req.user;
  res.json({ username, role, label });
});

// POST /api/auth/staff -> create a staff record and login, or add a login to existing staff
router.post('/staff', requireAuth, requireAdmin, async (req, res) => {
  const body = req.body || {};
  const isExistingStaff = body.staffId !== undefined;
  const staffData = body.staff || {};
  const name = String(staffData.name || '').trim();
  const phone = normalizePhone(body.phone);
  const password = String(body.password || '');
  const id = Number(isExistingStaff ? body.staffId : staffData.id);

  if ((!isExistingStaff && !name) || !Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'A valid staff name and ID are required' });
  }
  if (!validPhone(phone)) return res.status(400).json({ error: 'Enter a valid phone number' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (await User.exists({ username: phone })) return res.status(409).json({ error: 'A staff account already uses this phone number' });
  if (await User.exists({ staffId: id })) return res.status(409).json({ error: 'This staff member already has a staff account' });

  let staff;
  try {
    if (isExistingStaff) {
      staff = await Staff.findOne({ id });
      if (!staff) return res.status(404).json({ error: 'Staff member not found' });
      if (staff.archivedAt) return res.status(409).json({ error: 'Restore this staff member before creating a staff login' });
    } else {
      if (await Staff.exists({ id })) return res.status(409).json({ error: 'A staff member already uses this ID' });
      staff = await Staff.create({
        ...staffData,
        uid: String(id),
        seq: await Staff.countDocuments(),
        id,
        name
      });
    }

    const user = await User.create({
      username: phone,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'staff',
      label: isExistingStaff ? staff.name : name,
      staffId: id
    });
    staff.phone = phone;
    try {
      await staff.save();
    } catch (err) {
      await User.deleteOne({ _id: user._id });
      throw err;
    }
  } catch (err) {
    if (!isExistingStaff && staff) await Staff.deleteOne({ _id: staff._id });
    if (err.code === 11000) return res.status(409).json({ error: 'A staff account or staff member already uses these details' });
    throw err;
  }

  res.status(201).json({ staff: staff.toObject() });
});

router.put('/staff/:staffId', requireAuth, requireAdmin, async (req, res) => {
  const staffId = Number(req.params.staffId);
  if (!Number.isSafeInteger(staffId) || staffId <= 0) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }

  const body = req.body || {};
  const name = String(body.name || '').trim();
  const role = String(body.role || '').trim();
  const pin = String(body.pin || '').trim();
  const payroll = {};
  for (const field of ['baseSalary', 'otRate', 'allowance', 'advance']) {
    const value = Number(body[field]);
    if (!Number.isFinite(value) || value < 0) {
      return res.status(400).json({ error: `Enter a valid non-negative ${field}.` });
    }
    payroll[field] = value;
  }
  if (!name) return res.status(400).json({ error: 'Staff name is required' });
  if (!role) return res.status(400).json({ error: 'Staff role is required' });
  if (!/^\d{4}$/.test(pin)) return res.status(400).json({ error: 'PIN must contain exactly 4 digits' });

  const staff = await Staff.findOne({ id: staffId });
  if (!staff) return res.status(404).json({ error: 'Staff member not found' });
  Object.assign(staff, { name, role, pin, ...payroll });
  await staff.save();
  await User.updateOne({ staffId, role: 'staff' }, { $set: { label: name } });
  res.json({ staff: staff.toObject() });
});

// DELETE /api/auth/staff/:staffId -> archive staff and disable their account (admin only)
router.delete('/staff/:staffId', requireAuth, requireAdmin, async (req, res) => {
  const staffId = Number(req.params.staffId);
  if (!Number.isSafeInteger(staffId) || staffId <= 0) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }

  const staff = await Staff.findOne({ id: staffId });
  if (!staff) return res.status(404).json({ error: 'Staff member not found' });
  if (staff.clockedIn) return res.status(409).json({ error: 'Sign this staff member out before archiving them' });
  if (!staff.archivedAt) {
    staff.archivedAt = new Date();
    await staff.save();
  }
  await User.updateOne({ staffId, role: 'staff' }, { $set: { isActive: false } });
  res.json({ ok: true, staff: staff.toObject() });
});

// PATCH /api/auth/staff/:staffId/restore -> restore staff (admin only)
router.patch('/staff/:staffId/restore', requireAuth, requireAdmin, async (req, res) => {
  const staffId = Number(req.params.staffId);
  if (!Number.isSafeInteger(staffId) || staffId <= 0) {
    return res.status(400).json({ error: 'Invalid staff ID' });
  }

  const staff = await Staff.findOne({ id: staffId });
  if (!staff) return res.status(404).json({ error: 'Staff member not found' });
  staff.archivedAt = undefined;
  await staff.save();
  await User.updateOne({ staffId, role: 'staff' }, { $set: { isActive: true } });
  res.json({ ok: true, staff: staff.toObject() });
});

// PUT /api/auth/me -> staff may update their own name, phone, and password
router.put('/me', requireAuth, async (req, res) => {
  if (req.user.role !== 'staff') return res.status(403).json({ error: 'Staff access required' });

  const body = req.body || {};
  const name = String(body.name || '').trim();
  const phone = normalizePhone(body.phone);
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!validPhone(phone)) return res.status(400).json({ error: 'Enter a valid phone number' });
  if (newPassword && newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const user = await User.findById(req.user.sub);
  if (!user || !user.staffId) return res.status(404).json({ error: 'Staff account is not linked to a staff record' });
  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const staff = await Staff.findOne({ id: user.staffId });
  if (!staff) return res.status(404).json({ error: 'Staff record not found' });
  const duplicate = await User.findOne({ username: phone, _id: { $ne: user._id } });
  if (duplicate) return res.status(409).json({ error: 'A staff account already uses this phone number' });
  const duplicateStaff = await Staff.findOne({ phone, id: { $ne: user.staffId } });
  if (duplicateStaff) return res.status(409).json({ error: 'A staff member already uses this phone number' });

  user.username = phone;
  user.label = name;
  if (newPassword) user.passwordHash = await bcrypt.hash(newPassword, 10);
  staff.name = name;
  staff.phone = phone;

  try {
    await user.save();
    await staff.save();
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A staff account already uses this phone number' });
    throw err;
  }

  res.json({ user: { username: user.username, role: user.role, label: user.label } });
});

module.exports = router;
