const mongoose = require('mongoose');
const { randomInt } = require('node:crypto');

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

    const staffCollection = db.collection('staffs');
    const staffRows = await staffCollection.find({}, { projection: { id: 1 } }).toArray();
    const staffIds = new Set(staffRows.map(({ id }) => Number(id)).filter(Number.isSafeInteger));
    const allStaffUsers = await users.find({ role: { $ne: 'admin' } }).toArray();
    const largestKnownId = allStaffUsers.reduce(
      (largest, user) => Math.max(largest, Number(user.staffId) || 0),
      [...staffIds].reduce((largest, id) => Math.max(largest, id), 0)
    );
    let nextStaffId = largestKnownId + 1;
    let sequence = await staffCollection.countDocuments();

    for (const user of allStaffUsers) {
      let staffId = Number(user.staffId);
      if (!Number.isSafeInteger(staffId) || staffId <= 0) {
        while (staffIds.has(nextStaffId)) nextStaffId += 1;
        staffId = nextStaffId;
        nextStaffId += 1;
        await users.updateOne({ _id: user._id }, { $set: { staffId } });
      }

      const name = String(user.label || user.username || 'Staff').trim();
      const staff = await staffCollection.findOne({ id: staffId });
      if (staff) continue;

      await staffCollection.updateOne(
        { uid: String(staffId) },
        {
          $setOnInsert: {
            uid: String(staffId),
            seq: sequence++,
            id: staffId,
            name,
            phone: user.username,
            role: 'Staff',
            pin: String(randomInt(1000, 10000)),
            baseSalary: 48000,
            otRate: 350,
            allowance: 6000,
            advance: 0,
            clockedIn: false,
            lastClockIn: null
          }
        },
        { upsert: true }
      );
      staffIds.add(staffId);
    }
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
