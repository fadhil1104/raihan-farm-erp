require('dotenv').config();
require('express-async-errors'); // lets async route handlers throw into the error middleware
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { seedDatabase } = require('./src/seed/seedData');

const app = express();
const origins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/state', require('./src/routes/state'));
app.use('/api/attendance', require('./src/routes/attendance'));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

process.on('unhandledRejection', (e) => console.error('Unhandled rejection:', e));

(async () => {
  await connectDB();
  if (process.env.SEED_ON_START !== 'false') await seedDatabase();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Raihan Farm ERP API running on http://localhost:${port}`));
})().catch((e) => { console.error('Startup failed:', e.message); process.exit(1); });
