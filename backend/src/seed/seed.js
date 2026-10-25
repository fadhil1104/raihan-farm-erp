// Creates configured admin and staff users without adding business records.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { seedDatabase } = require('./seedData');

(async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
