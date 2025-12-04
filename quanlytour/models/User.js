// server/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','customer'], default: 'customer' }
}, { timestamps: true });

UserSchema.methods.setPassword = async function (pwd) {
  this.passwordHash = await bcrypt.hash(pwd, 10);
};
UserSchema.methods.validatePassword = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
