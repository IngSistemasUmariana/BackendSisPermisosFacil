const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Request = require('../models/Request');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth'); // Importa el middleware
const axios = require('axios');
const router = express.Router();

// Crear un nuevo administrador (PROTEGIDA)
router.post('/admins', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el administrador ya existe
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send('El administrador ya existe.');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).send('Administrador creado exitosamente.');
  } catch (error) {
    res.status(500).send('Error al crear el administrador.');
  }
});

// Obtener todos los administradores (PROTEGIDA)
router.get('/admins', authMiddleware, async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 }); // Excluir contraseñas
    res.json(admins);
  } catch (error) {
    res.status(500).send('Error al obtener los administradores.');
  }
});

// Actualizar un administrador (PROTEGIDA)
router.put('/admins/:id', authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Si hay contraseña, encriptarla antes de actualizar
    let updateData = { email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedAdmin) {
      return res.status(404).send('Administrador no encontrado.');
    }

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).send('Error al actualizar el administrador.');
  }
});

// Eliminar un administrador (PROTEGIDA)
router.delete('/admins/:id', authMiddleware, async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).send('Administrador no encontrado.');
    }

    res.send('Administrador eliminado exitosamente.');
  } catch (error) {
    res.status(500).send('Error al eliminar el administrador.');
  }
});

module.exports = router;

// Login de administrador
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).send('Credenciales inválidas.');
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error al iniciar sesión.');
  }
});

// Obtener todas las solicitudes (PROTEGIDA)
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    res.status(500).send('Error al obtener las solicitudes.');
  }
});



// Obtener todas las solicitudes (PROTEGIDA)
router.get('/requestsProfesoreSistemas2025Secured', async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    res.status(500).send('Error al obtener las solicitudes.');
  }
});


// Aprobar o rechazar solicitudes (PROTEGIDA)
router.put('/requests/:id', authMiddleware, async (req, res) => {
  try {
    const { status, reason } = req.body;
 
    // Validar que status y reason están presentes
    if (!status || !reason) {
      return res.status(400).json({
        message: 'Los campos "status" y "reason" son obligatorios.',
      });
    }

    // Validar que el status sea Aceptado o Denegado
    if (!['Aceptado', 'Denegado'].includes(status)) {
      return res.status(400).json({
        message: 'Estado inválido. Debe ser "Aceptado" o "Denegado".',
      });
    }

    // Buscar la solicitud por ID
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }

    // Verificar si ya tiene el mismo estado
    if (request.status === status) {
      return res.status(400).json({
        message: `La solicitud ya tiene el estado "${status}".`,
      });
    }

    // Actualizar solo los campos necesarios
    request.status = status;
    request.reason = reason;
    await request.save();

    // Responder con éxito
    res.status(200).json({
      message: 'Permiso actualizado correctamente.',
      data: {
        id: request._id,
        status: request.status,
        reason: request.reason,
        updatedAt: request.updatedAt,
      },
    });
  } catch (error) {
    console.log(error)
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({
      message: 'Error interno del servidor al procesar la solicitud.',
    });
  }
});



module.exports = router;
