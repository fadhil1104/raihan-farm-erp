const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = () => process.env.JWT_SECRET || 'dev-secret-change-me';

const signToken = (user) =>
  jwt.sign({ sub: String(user._id), username: user.username, role: user.role, label: user.label },
    secret(), { expiresIn: process.env.JWT_EXPIRES_IN || '12h' });

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  let payload;
  try {
    payload = jwt.verify(token, secret());
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  const user = await User.findById(payload.sub).select('isActive').lean();
  if (!user || user.isActive === false) return res.status(401).json({ error: 'Account is inactive or no longer exists' });
  req.user = payload;
  next();
}

const requireAdmin = (req, res, next) =>
  req.user && req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Admin access required' });

const requireWriter = (req, res, next) =>
  req.user && req.user.role !== 'accountant'
    ? next()
    : res.status(403).json({ error: 'Accountant accounts have read-only access' });

const requireFarm = (req, res, next) =>
  req.user && req.user.role === 'farm'
    ? next()
    : res.status(403).json({ error: 'Farm account access required' });

module.exports = { signToken, requireAuth, requireAdmin, requireWriter, requireFarm };
