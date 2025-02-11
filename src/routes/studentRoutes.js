// src/routes/studentRoutes.js
const express = require('express');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth'); // Middleware para proteger rutas
const router = express.Router();

// Crear un nuevo estudiante (PROTEGIDA)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { studentId, name, email, semester } = req.body;

    const newStudent = new Student({ studentId, name, email, semester });
    await newStudent.save();
    res.status(201).send('Estudiante creado con éxito.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el estudiante.');
  }
});

// Obtener todos los estudiantes (PROTEGIDA)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).send('Error al obtener los estudiantes.');
  }
});

// Editar un estudiante por su ID (PROTEGIDA)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email, semester } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, semester },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).send('Estudiante no encontrado.');
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el estudiante.');
  }
});

// Eliminar un estudiante por su ID (PROTEGIDA)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).send('Estudiante no encontrado.');
    }

    res.send('Estudiante eliminado con éxito.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el estudiante.');
  }
});

// Buscar un estudiante por su número de cédula (NO PROTEGIDA)
router.get('/cedula/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).send('Estudiante no encontrado.');
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar el estudiante.');
  }
});

// Verificar el estado de la API
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});


module.exports = router;

