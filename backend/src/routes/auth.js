const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { Employee } = require('../models');
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

// POST /api/auth/staff -> create an employee and their staff login (admin only)
router.post('/staff', requireAuth, requireAdmin, async (req, res) => {
  const body = req.body || {};
  const isExistingEmployee = body.employeeId !== undefined;
  const employeeData = body.employee || {};
  const name = String(employeeData.name || '').trim();
  const phone = normalizePhone(body.phone);
  const password = String(body.password || '');
  const id = Number(isExistingEmployee ? body.employeeId : employeeData.id);

  if ((!isExistingEmployee && !name) || !Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'A valid employee name and ID are required' });
  }
  if (!validPhone(phone)) return res.status(400).json({ error: 'Enter a valid phone number' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (await User.exists({ username: phone })) return res.status(409).json({ error: 'A staff account already uses this phone number' });
  if (await User.exists({ employeeId: id })) return res.status(409).json({ error: 'This employee already has a staff account' });

  let employee;
  try {
    if (isExistingEmployee) {
      employee = await Employee.findOne({ id });
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      if (employee.archivedAt) return res.status(409).json({ error: 'Restore this employee before creating a staff login' });
    } else {
      if (await Employee.exists({ id })) return res.status(409).json({ error: 'An employee already uses this ID' });
      employee = await Employee.create({
        ...employeeData,
        uid: String(id),
        seq: await Employee.countDocuments(),
        id,
        name
      });
    }

    const user = await User.create({
      username: phone,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'staff',
      label: isExistingEmployee ? employee.name : name,
      employeeId: id
    });
    employee.phone = phone;
    try {
      await employee.save();
    } catch (err) {
      await User.deleteOne({ _id: user._id });
      throw err;
    }
  } catch (err) {
    if (!isExistingEmployee && employee) await Employee.deleteOne({ _id: employee._id });
    if (err.code === 11000) return res.status(409).json({ error: 'A staff account or employee already uses these details' });
    throw err;
  }

  res.status(201).json({ employee: employee.toObject() });
});

// DELETE /api/auth/staff/:employeeId -> archive employee and disable their account (admin only)
router.delete('/staff/:employeeId', requireAuth, requireAdmin, async (req, res) => {
  const employeeId = Number(req.params.employeeId);
  if (!Number.isSafeInteger(employeeId) || employeeId <= 0) {
    return res.status(400).json({ error: 'Invalid employee ID' });
  }

  const employee = await Employee.findOne({ id: employeeId });
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  if (employee.clockedIn) return res.status(409).json({ error: 'Sign this employee out before archiving them' });
  if (!employee.archivedAt) {
    employee.archivedAt = new Date();
    await employee.save();
  }
  await User.updateOne({ employeeId, role: 'staff' }, { $set: { isActive: false } });
  res.json({ ok: true, employee: employee.toObject() });
});

// PATCH /api/auth/staff/:employeeId/restore -> restore an archived employee (admin only)
router.patch('/staff/:employeeId/restore', requireAuth, requireAdmin, async (req, res) => {
  const employeeId = Number(req.params.employeeId);
  if (!Number.isSafeInteger(employeeId) || employeeId <= 0) {
    return res.status(400).json({ error: 'Invalid employee ID' });
  }

  const employee = await Employee.findOne({ id: employeeId });
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  employee.archivedAt = undefined;
  await employee.save();
  await User.updateOne({ employeeId, role: 'staff' }, { $set: { isActive: true } });
  res.json({ ok: true, employee: employee.toObject() });
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
  if (!user || !user.employeeId) return res.status(404).json({ error: 'Staff account is not linked to an employee record' });
  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const employee = await Employee.findOne({ id: user.employeeId });
  if (!employee) return res.status(404).json({ error: 'Employee record not found' });
  const duplicate = await User.findOne({ username: phone, _id: { $ne: user._id } });
  if (duplicate) return res.status(409).json({ error: 'A staff account already uses this phone number' });
  const duplicateEmployee = await Employee.findOne({ phone, id: { $ne: user.employeeId } });
  if (duplicateEmployee) return res.status(409).json({ error: 'A staff member already uses this phone number' });

  user.username = phone;
  user.label = name;
  if (newPassword) user.passwordHash = await bcrypt.hash(newPassword, 10);
  employee.name = name;
  employee.phone = phone;

  try {
    await user.save();
    await employee.save();
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A staff account already uses this phone number' });
    throw err;
  }

  res.json({ user: { username: user.username, role: user.role, label: user.label } });
});

module.exports = router;
