const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error al conectar MongoDB:', err));

// Rutas
const requestRoutes = require('./src/routes/requestRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/requests', requestRoutes);
app.use('/admin', adminRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
