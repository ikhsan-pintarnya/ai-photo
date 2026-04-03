const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  lastUsed: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Usage', usageSchema);
