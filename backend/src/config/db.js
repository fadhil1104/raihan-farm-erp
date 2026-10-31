const mongoose = require('mongoose');

let staffMigration;

async function migrateLegacyEmployeeData() {
  const db = mongoose.connection.db;
  const names = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(({ name }) => name));

  if (names.has('employees')) {
    const employeeCollection = db.collection('employees');
    const staffCollection = db.collection('staffs');
    const employees = await employeeCollection.find().toArray();
    for (const employee of employees) {
      const { _id, ...staff } = employee;
      staff.uid = String(staff.uid ?? staff.id ?? _id);
      await staffCollection.updateOne({ uid: staff.uid }, { $setOnInsert: staff }, { upsert: true });
    }
    await employeeCollection.drop();
    console.log(`Migrated ${employees.length} employee records to the staffs collection`);
  }

  if (names.has('users')) {
    const users = db.collection('users');
    await users.updateMany(
      { employeeId: { $exists: true }, staffId: { $exists: false } },
      { $rename: { employeeId: 'staffId' } }
    );
    await users.updateMany(
      { employeeId: { $exists: true }, staffId: { $exists: true } },
      { $unset: { employeeId: '' } }
    );
  }

  if (names.has('attendancelogs')) {
    const attendanceLogs = db.collection('attendancelogs');
    const indexes = await attendanceLogs.listIndexes().toArray();
    const legacyStaffIndex = indexes.find((index) => index.key.empId);
    if (legacyStaffIndex) await attendanceLogs.dropIndex(legacyStaffIndex.name);
    await attendanceLogs.updateMany(
      { empId: { $exists: true }, staffId: { $exists: false } },
      { $rename: { empId: 'staffId' } }
    );
    await attendanceLogs.updateMany(
      { empId: { $exists: true }, staffId: { $exists: true } },
      { $unset: { empId: '' } }
    );
    await attendanceLogs.createIndex({ staffId: 1, date: 1 });
  }
}

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/raihan_farm_erp';
  mongoose.set('strictQuery', true);
  if (mongoose.connection.readyState !== 1) await mongoose.connect(uri);
  if (!staffMigration) staffMigration = migrateLegacyEmployeeData();
  await staffMigration;
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};
