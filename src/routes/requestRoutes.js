// src/routes/requestRoutes.js
const express = require('express');
const Request = require('../models/Request');
const Student = require('../models/Student');
const router = express.Router();

function addBusinessDays(date, days) {
  let result = new Date(date);
  let count = 0;
  while (count < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) { // Ignora sábados y domingos
      count++;
    }
  }
  return result;
}

router.post('/', async (req, res) => {
  try {
    const {
      studentId,
      startDate,
      endDate,
      briefExplanation,
      evidence // La URL del archivo subido desde el frontend
    } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).send('Estudiante no encontrado.');
    }

    const expirationDate = addBusinessDays(new Date(endDate), 3);
    const expirationStatus = new Date() <= expirationDate ? 'En tiempo' : 'Extemporáneo';

    const newRequest = new Request({
      fullName: student.name + " " + student.last_name,
      institutionalEmail: student.email,
      studentId: student.studentId,
      semester: student.semester,
      startDate,
      endDate,
      briefExplanation,
      expirationStatus,
      evidence // Guardamos directamente la URL
    });

    await newRequest.save();
    res.status(201).send('Solicitud creada con éxito.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la solicitud.');
  }
});

module.exports = router;
