const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
// Ruta health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Middlewares
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error al conectar MongoDB:', err));

// Rutas
const requestRoutes = require('./src/routes/requestRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
app.use('/requests', requestRoutes);
app.use('/admin', adminRoutes);
app.use('/students', studentRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
