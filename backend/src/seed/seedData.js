const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function ensureUsers() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) return;
    throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD before starting the server.');
  }

  const exists = await User.findOne({ username: adminUsername.toLowerCase() });
  if (exists) return;

  await User.create({
    username: adminUsername,
    passwordHash: await bcrypt.hash(adminPassword, 10),
    role: 'admin',
    label: 'Admin (Full Access)'
  });
  console.log(`Created admin user: ${adminUsername}`);
}

async function seedDatabase() {
  await ensureUsers();
  console.log('Admin setup complete. No demo business data was added.');
}

module.exports = { seedDatabase };
