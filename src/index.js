const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ app: 'demo-cicd-s16', status: 'running', endpoints: ['/health', '/api/saludo', '/api/adios'] });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', estado: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/saludo', (req, res) => {
  const nombre = req.query.nombre || 'Mundo';
  if (nombre.length > 20) {
    return res.status(400).json({ error: 'Nombre demasiado largo' });
  }
  res.json({ mensaje: `Hola, ${nombre}!` });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
}

module.exports = app;
