const request = require('supertest');
const app = require('../src/index');

describe('API Endpoints', () => {
  test('GET /health devuelve status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });


test('GET /api/status retorna uptime y memoria', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('GET /api/saludo responde con el nombre dado', async () => {
    const res = await request(app).get('/api/saludo?nombre=Docker');
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe('Hola, Docker!');
  });

  test('GET /api/saludo responde con Mundo si no hay nombre', async () => {
    const res = await request(app).get('/api/saludo');
    expect(res.body.mensaje).toBe('Hola, Mundo!');
  });

  test('GET /api/saludo rechaza nombres demasiado largos', async () => {
    const res = await request(app).get('/api/saludo?nombre=NombreMuyLargoQueExcedeElLimite');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Nombre demasiado largo');
  });

test('GET /api/tiempo retorna ciudad y temperatura', async () => {
    const res = await request(app).get('/api/tiempo?ciudad=Hermosillo');
    expect(res.statusCode).toBe(200);
    expect(res.body.ciudad).toBe('Hermosillo');
    expect(res.body.temperatura).toBe(38);
  });
});
