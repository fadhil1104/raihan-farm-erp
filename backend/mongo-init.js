// MongoDB initialisation script (collections + indexes).
// Docker:  mounted automatically into /docker-entrypoint-initdb.d (see docker-compose.yml)
// Manual:  mongosh "mongodb://127.0.0.1:27017/raihan_farm_erp" database/mongo-init.js
//
// The Node backend also creates these through Mongoose, so running this is optional.

const dbName = 'raihan_farm_erp';
const database = db.getSiblingDB(dbName);

const collections = [
  'users', 'inventoryitems', 'inventoryapprovals', 'customers', 'slaughterbatches', 'possales',
  'receivables', 'monthlyhistories', 'weeklyhistories', 'staffs', 'attendancelogs',
  'deliveries', 'subscriptions', 'dailyvaults'
];

collections.forEach((name) => {
  if (!database.getCollectionNames().includes(name)) database.createCollection(name);
});

database.users.createIndex({ username: 1 }, { unique: true });
collections.filter((c) => c !== 'users').forEach((name) => {
  database[name].createIndex({ uid: 1 }, { unique: true });
});

// Handy query indexes
database.possales.createIndex({ date: 1 });
database.slaughterbatches.createIndex({ date: 1 });
database.attendancelogs.createIndex({ staffId: 1, date: 1 });
database.receivables.createIndex({ status: 1 });
database.dailyvaults.createIndex({ date: 1 }, { unique: true });

print(`Raihan Farm ERP: collections and indexes ready in "${dbName}"`);
