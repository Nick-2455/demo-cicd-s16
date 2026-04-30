const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ app: 'demo-cicd-s16', status: 'running', endpoints: ['/health', '/api/adios', '/api/tiempo'] });
});

app.get('/api/status', (req, res) => {
  res.json({ uptime: process.uptime(), memory: process.memoryUsage().rss, ok: true });
});

app.get('/health', (req, res) => {
  res.status(500).json({ status: 'ERROR', estado: 'ERROR', timestamp: new Date().toISOString() });
});



app.get('/api/tiempo', (req, res) => {
  const ciudad = req.query.ciudad || 'Hermosillo';
  res.json({ ciudad: ciudad, temperatura: 38 });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
}

module.exports = app;
