const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { FarmAnimalType } = require('../models');

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

async function ensureAccountant() {
  const username = String(process.env.ACCOUNTANT_USERNAME || 'accountant').trim().toLowerCase();
  const password = process.env.ACCOUNTANT_PASSWORD;
  if (!password) {
    console.log('Accountant account not created: set ACCOUNTANT_PASSWORD to enable it.');
    return;
  }
  if (password.length < 8) {
    throw new Error('ACCOUNTANT_PASSWORD must be at least 8 characters.');
  }

  const existing = await User.findOne({ username });
  if (existing) {
    if (existing.role !== 'accountant') {
      throw new Error(`Cannot create accountant account: username "${username}" is already assigned to another role.`);
    }
    return;
  }

  await User.create({
    username,
    passwordHash: await bcrypt.hash(password, 10),
    role: 'accountant',
    label: 'Accountant (View Only)'
  });
  console.log(`Created accountant user: ${username}`);
}

async function ensureFarmUser() {
  const username = String(process.env.FARM_USERNAME || 'farm').trim().toLowerCase();
  const password = process.env.FARM_PASSWORD;
  if (!password) {
    console.log('Farm account not created: set FARM_PASSWORD to enable it.');
    return;
  }
  if (password.length < 8) {
    throw new Error('FARM_PASSWORD must be at least 8 characters.');
  }

  const existing = await User.findOne({ username });
  if (existing) {
    if (existing.role !== 'farm') {
      throw new Error(`Cannot create farm account: username "${username}" is already assigned to another role.`);
    }
    return;
  }

  await User.create({
    username,
    passwordHash: await bcrypt.hash(password, 10),
    role: 'farm',
    label: 'Raihan Farm'
  });
  console.log(`Created farm user: ${username}`);
}

async function ensureFarmAnimalTypes() {
  const names = ['Broiler Chicken', 'Duck', 'Quail', 'Turkey', 'Farm Chicken', 'Parent Chicken'];
  await Promise.all(names.map((name) => {
    const normalizedName = name.toLowerCase();
    return FarmAnimalType.updateOne(
      { normalizedName },
      { $setOnInsert: { name, normalizedName } },
      { upsert: true }
    );
  }));
}

async function seedDatabase() {
  await ensureUsers();
  await ensureAccountant();
  await ensureFarmUser();
  await ensureFarmAnimalTypes();
  console.log('User setup complete. No demo business data was added.');
}

module.exports = { seedDatabase };
