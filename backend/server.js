require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const { seedDatabase } = require('./src/seed/seedData');

const app = express();

const origins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: origins.length ? origins : true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Ensure the database is connected before handling API requests.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);

    res.status(503).json({
      error: 'Database connection failed',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Raihan Farm ERP API is running',
    time: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/state', require('./src/routes/state'));
app.use('/api/attendance', require('./src/routes/attendance'));

// API 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.status && err.status < 500
      ? err.message
      : 'Internal server error',
  });
});

// Local development only
if (require.main === module) {
  const port = process.env.PORT || 5000;

  connectDB()
    .then(() => seedDatabase())
    .then(() => {
      app.listen(port, () => {
        console.log(`Raihan Farm ERP API running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Startup failed:', error);
      process.exit(1);
    });
}

// Export the application for Vercel
module.exports = app;