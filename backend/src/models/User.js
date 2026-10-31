const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff'], required: true },
    label: { type: String, default: '' },
    staffId: { type: Number, unique: true, sparse: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
