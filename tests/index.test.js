const request = require('supertest');
const app = require('../src/index');

describe('API Endpoints', () => {
  test('GET /health devuelve status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
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

  test('GET /api/version retorna la version de la app', async () => {
    const res = await request(app).get('/api/version');
    expect(res.statusCode).toBe(200);
    expect(res.body.version).toBe('1.0.0');
  });
});
