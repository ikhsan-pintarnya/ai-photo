const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  clientId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  timestamp: { type: Number, required: true },
  sourceImage: {
    base64: String,
    mimeType: String,
  },
  features: mongoose.Schema.Types.Mixed,
  generatedImages: [
    {
      id: String,
      base64: String,
      promptUsed: String,
      mimeType: String,
    },
  ],
});

module.exports = mongoose.model('Project', projectSchema);
