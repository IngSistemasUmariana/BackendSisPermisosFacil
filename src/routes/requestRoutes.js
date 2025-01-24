const express = require('express');
const multer = require('multer');
const Request = require('../models/Request');
const router = express.Router();


// Crear una nueva solicitud
router.post('/',  async (req, res) => {
  try {
    const {  fullName, institutionalEmail,pdfFile,evidenceImage} = req.body;
   
    const newRequest = new Request({
      fullName,
      institutionalEmail,
      pdfFile,
      evidenceImage,
    });

    await newRequest.save();
    res.status(201).send('Solicitud enviada con éxito.');
  } catch (error) {
  
    res.status(500).send('Error al crear la solicitud.');
  }
});

module.exports = router;
