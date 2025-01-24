const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  fullName: { type: String, required: true },
  institutionalEmail: { type: String, required: true },
  pdfFile: { type: String, required: true },
  evidenceImage: { type: String, required: true },
  status: { type: String, default: 'Pendiente' },
  reason: { type: String, default: '' }, // 'Pending', 'Accepted', 'Rejected'
});

module.exports = mongoose.model('request', requestSchema);
