const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken, requireAuth } = require('../middleware/auth');

// POST /api/auth/login  { username, password }
router.post('/login', async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: signToken(user), user: { username: user.username, role: user.role, label: user.label } });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const { username, role, label } = req.user;
  res.json({ username, role, label });
});

module.exports = router;
