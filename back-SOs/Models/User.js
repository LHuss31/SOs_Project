const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);