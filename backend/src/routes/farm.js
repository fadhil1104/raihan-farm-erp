const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const { FarmAnimalType, FarmBatch } = require('../models');
const { requireAuth, requireFarm } = require('../middleware/auth');
const { randomUUID } = require('node:crypto');

router.use(requireAuth, requireFarm);

const validDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const positiveNumber = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;
const nonNegativeNumber = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const round2 = (value) => Number(value.toFixed(2));
const serializeBatch = (batch) => {
  const result = batch.toObject ? batch.toObject() : { ...batch };
  delete result._id;
  delete result.__v;
  return result;
};

router.get('/', async (req, res) => {
  const [types, batches] = await Promise.all([
    FarmAnimalType.find().sort({ name: 1 }).lean(),
    FarmBatch.find().sort({ createdAt: -1 }).lean()
  ]);
  res.json({
    animalTypes: types.map(({ _id, name }) => ({ id: String(_id), name })),
    batches: batches.map(({ _id, __v, ...batch }) => batch)
  });
});

router.post('/animal-types', async (req, res) => {
  const name = String(req.body?.name || '').trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 40) {
    return res.status(400).json({ error: 'Animal type must be between 2 and 40 characters.' });
  }

  const normalizedName = name.toLowerCase();
  try {
    const type = await FarmAnimalType.create({ name, normalizedName });
    return res.status(201).json({ animalType: { id: String(type._id), name: type.name } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'This animal type already exists.' });
    throw error;
  }
});

router.post('/batches', async (req, res) => {
  const body = req.body || {};
  const animalTypeId = String(body.animalTypeId || '');
  if (!mongoose.isValidObjectId(animalTypeId)) {
    return res.status(400).json({ error: 'Select a valid animal type.' });
  }
  const animalType = await FarmAnimalType.findById(animalTypeId);
  if (!animalType) return res.status(400).json({ error: 'Select a valid animal type.' });

  const source = String(body.source || '');
  const startDate = String(body.startDate || '');
  const supplier = String(body.supplier || '').trim();
  const purchaseAmountRs = body.purchaseAmountRs;
  const initialCount = body.initialCount;
  const initialLiveWeightKg = positiveNumber(body.initialLiveWeightKg)
    ? round2(body.initialLiveWeightKg)
    : body.initialLiveWeightKg;
  if (!['OWN_RAISED', 'PURCHASED'].includes(source)) {
    return res.status(400).json({ error: 'Select whether this batch is own-raised or purchased.' });
  }
  if (!validDate(startDate)) return res.status(400).json({ error: 'Enter a valid batch date.' });
  if (!Number.isSafeInteger(initialCount) || initialCount < 1) {
    return res.status(400).json({ error: 'Bird/animal count must be a whole number greater than zero.' });
  }
  if (!positiveNumber(initialLiveWeightKg)) {
    return res.status(400).json({ error: 'Starting live weight must be greater than zero.' });
  }
  if (source === 'PURCHASED' && !supplier) {
    return res.status(400).json({ error: 'Enter the outside farm or supplier for purchased batches.' });
  }
  if (source === 'PURCHASED' && !nonNegativeNumber(purchaseAmountRs)) {
    return res.status(400).json({ error: 'Enter a valid non-negative outside purchase amount.' });
  }
  if (supplier.length > 100) return res.status(400).json({ error: 'Supplier name must be 100 characters or fewer.' });

  const batch = await FarmBatch.create({
    batchId: randomUUID(),
    animalTypeId: String(animalType._id),
    animalType: animalType.name,
    source,
    supplier: source === 'PURCHASED' ? supplier : '',
    purchaseAmountRs: source === 'PURCHASED' ? round2(purchaseAmountRs) : 0,
    startDate,
    initialCount,
    initialLiveWeightKg,
    currentCount: initialCount,
    currentLiveWeightKg: initialLiveWeightKg,
    events: [{
      id: randomUUID(),
      type: 'BATCH_STARTED',
      date: startDate,
      source,
      count: initialCount,
      weightKg: initialLiveWeightKg,
      amountRs: source === 'PURCHASED' ? round2(purchaseAmountRs) : 0,
      supplier: source === 'PURCHASED' ? supplier : '',
      note: source === 'OWN_RAISED' ? 'Own-raised animals placed in farm batch.' : 'Animals received from outside farm.',
      createdAt: new Date().toISOString()
    }]
  });
  res.status(201).json({ batch: serializeBatch(batch) });
});

router.post('/batches/:batchId/events', async (req, res) => {
  const batch = await FarmBatch.findOne({ batchId: req.params.batchId });
  if (!batch) return res.status(404).json({ error: 'Farm batch not found.' });

  const body = req.body || {};
  const type = String(body.type || '');
  const date = String(body.date || '');
  const note = String(body.note || '').trim();
  if (!validDate(date)) return res.status(400).json({ error: 'Enter a valid event date.' });
  if (note.length > 240) return res.status(400).json({ error: 'Notes must be 240 characters or fewer.' });
  if (!['FEED_PURCHASE', 'FEED_USE', 'TRANSPORT', 'MORTALITY', 'DELIVERY', 'WEIGHT_CHECK'].includes(type)) {
    return res.status(400).json({ error: 'Select a valid batch event.' });
  }
  if (batch.currentCount < 1) {
    return res.status(409).json({ error: 'This batch has no live animals remaining.' });
  }

  const event = { id: randomUUID(), type, date, note, createdAt: new Date().toISOString() };
  const increments = {};
  const setFields = {};

  if (type === 'FEED_PURCHASE') {
    if (!positiveNumber(body.quantityKg) || !nonNegativeNumber(body.amountRs)) {
      return res.status(400).json({ error: 'Enter a feed quantity greater than zero and a valid purchase cost.' });
    }
    const quantityKg = round2(body.quantityKg);
    if (!positiveNumber(quantityKg)) return res.status(400).json({ error: 'Feed quantity must be at least 0.01 kg.' });
    const amountRs = round2(body.amountRs);
    event.quantityKg = quantityKg;
    event.amountRs = amountRs;
    event.supplier = String(body.supplier || '').trim().slice(0, 100);
    increments.feedPurchasedKg = quantityKg;
    increments.feedBalanceKg = quantityKg;
    increments.feedCostRs = amountRs;
  } else if (type === 'FEED_USE') {
    if (!positiveNumber(body.quantityKg)) {
      return res.status(400).json({ error: 'Enter a feed usage quantity greater than zero.' });
    }
    const quantityKg = round2(body.quantityKg);
    if (!positiveNumber(quantityKg)) return res.status(400).json({ error: 'Feed usage must be at least 0.01 kg.' });
    if (quantityKg > batch.feedBalanceKg) {
      return res.status(409).json({ error: 'Feed used cannot exceed this batch’s remaining feed balance.' });
    }
    event.quantityKg = quantityKg;
    increments.feedUsedKg = quantityKg;
    increments.feedBalanceKg = -quantityKg;
  } else if (type === 'TRANSPORT') {
    if (!nonNegativeNumber(body.amountRs)) {
      return res.status(400).json({ error: 'Enter a valid non-negative transport cost.' });
    }
    const amountRs = round2(body.amountRs);
    event.amountRs = amountRs;
    increments.transportCostRs = amountRs;
  } else if (type === 'MORTALITY') {
    if (!Number.isSafeInteger(body.count) || body.count < 1 || body.count > batch.currentCount) {
      return res.status(400).json({ error: 'Mortality count must be a whole number within the batch’s live count.' });
    }
    const defaultWeight = batch.currentCount
      ? batch.currentLiveWeightKg * body.count / batch.currentCount
      : 0;
    const weightKg = round2(body.weightKg === undefined ? defaultWeight : body.weightKg);
    if (!positiveNumber(weightKg) || weightKg > batch.currentLiveWeightKg) {
      return res.status(400).json({ error: 'Enter a valid mortality weight no greater than the batch’s live weight.' });
    }
    if (body.count === batch.currentCount && Math.abs(weightKg - batch.currentLiveWeightKg) > 0.01) {
      return res.status(400).json({ error: 'For final-batch mortality, enter the batch’s full remaining live weight.' });
    }
    const recordedWeightKg = body.count === batch.currentCount ? batch.currentLiveWeightKg : weightKg;
    event.count = body.count;
    event.weightKg = recordedWeightKg;
    increments.mortalityCount = body.count;
    increments.mortalityWeightKg = recordedWeightKg;
    increments.currentCount = -body.count;
    increments.currentLiveWeightKg = -recordedWeightKg;
  } else if (type === 'DELIVERY') {
    if (!Number.isSafeInteger(body.count) || body.count < 1 || body.count > batch.currentCount) {
      return res.status(400).json({ error: 'Delivery count must be a whole number within the batch’s live count.' });
    }
    if (!positiveNumber(body.weightKg)) {
      return res.status(400).json({ error: 'Enter a valid delivered live weight within the batch’s live weight.' });
    }
    const weightKg = round2(body.weightKg);
    if (!positiveNumber(weightKg) || weightKg > batch.currentLiveWeightKg) {
      return res.status(400).json({ error: 'Enter a valid delivered live weight within the batch’s live weight.' });
    }
    if (body.count === batch.currentCount && Math.abs(weightKg - batch.currentLiveWeightKg) > 0.01) {
      return res.status(400).json({ error: 'For the final delivery, enter the batch’s full remaining live weight.' });
    }
    if (body.amountRs !== undefined && !nonNegativeNumber(body.amountRs)) {
      return res.status(400).json({ error: 'Enter a valid non-negative delivery amount.' });
    }
    const amountRs = round2(body.amountRs || 0);
    const deliveredWeightKg = body.count === batch.currentCount ? batch.currentLiveWeightKg : weightKg;
    event.count = body.count;
    event.weightKg = deliveredWeightKg;
    event.amountRs = amountRs;
    event.destination = 'Raihan Chicken Shop';
    increments.deliveredCount = body.count;
    increments.deliveredWeightKg = deliveredWeightKg;
    increments.deliveredAmountRs = amountRs;
    increments.currentCount = -body.count;
    increments.currentLiveWeightKg = -deliveredWeightKg;
  } else {
    if (!positiveNumber(body.weightKg)) {
      return res.status(400).json({ error: 'Enter a new total live weight greater than zero.' });
    }
    const weightKg = round2(body.weightKg);
    if (!positiveNumber(weightKg)) {
      return res.status(400).json({ error: 'Weight must be at least 0.01 kg.' });
    }
    const changeKg = round2(weightKg - batch.currentLiveWeightKg);
    if (changeKg < 0 && Math.abs(changeKg) > batch.currentLiveWeightKg) {
      return res.status(400).json({ error: 'Weight loss cannot exceed the batch’s current live weight.' });
    }
    event.weightKg = weightKg;
    event.changeKg = changeKg;
    setFields.currentLiveWeightKg = weightKg;
    if (changeKg > 0) increments.measuredGainKg = changeKg;
    if (changeKg < 0) increments.measuredLossKg = Math.abs(changeKg);
  }

  const update = { $push: { events: event } };
  if (Object.keys(increments).length) update.$inc = increments;
  if (Object.keys(setFields).length) update.$set = setFields;
  const updated = await FarmBatch.findOneAndUpdate(
    {
      _id: batch._id,
      currentCount: batch.currentCount,
      currentLiveWeightKg: batch.currentLiveWeightKg,
      feedBalanceKg: batch.feedBalanceKg
    },
    update,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(409).json({ error: 'This batch changed on another device. Refresh and retry the event.' });
  res.status(201).json({ batch: serializeBatch(updated) });
});

router.put('/password', async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');
  if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters.' });

  const user = await User.findById(req.user.sub);
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ ok: true });
});

module.exports = router;
