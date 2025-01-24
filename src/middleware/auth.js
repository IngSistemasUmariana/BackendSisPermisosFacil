const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Acceso denegado. No se proporcionó un token.');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified; // Información del administrador autenticado
    next();
  } catch (err) {
    res.status(400).send('Token inválido.');
  }
};

module.exports = authMiddleware;
