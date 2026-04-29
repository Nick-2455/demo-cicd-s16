const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ app: 'demo-cicd-s16', status: 'running', endpoints: ['/health', '/api/saludo', '/api/adios', '/api/clima'] });
});

app.get('/api/status', (req, res) => {
  res.json({ uptime: process.uptime(), memory: process.memoryUsage().rss, ok: true });
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

app.get('/api/clima', (req, res) => {
  const ciudad = req.query.ciudad || 'Hermosillo';
  res.json({ ciudad: ciudad, temperatura: 38 });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
}

module.exports = app;
