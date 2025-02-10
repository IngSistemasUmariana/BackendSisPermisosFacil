// src/models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  fullName: { type: String, required: true },
  institutionalEmail: { type: String, required: true },
  studentId: { type: String, required: true },
  semester: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  briefExplanation: { type: String, required: true },
  expirationStatus: { type: String, enum: ['En tiempo', 'Extemporáneo'], required: true },
  evidence: { type: String, required: true }, // URL del archivo
  status: { type: String, default: 'Pendiente' },
  reason: { type: String, default: '' }
});

module.exports = mongoose.model('Request', requestSchema);
