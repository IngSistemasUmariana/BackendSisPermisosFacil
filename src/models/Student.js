// src/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, // Número de cédula
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  semester: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
