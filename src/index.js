const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/saludo', (req, res) => {
  const nombre = req.query.nombre || 'Mundo';
  res.json({ mensaje: `Hola, ${nombre}!` });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
}

module.exports = app;
