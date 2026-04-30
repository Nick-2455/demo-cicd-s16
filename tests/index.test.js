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

  test('GET /api/tiempo retorna ciudad y temperatura', async () => {
    const res = await request(app).get('/api/tiempo?ciudad=Hermosillo');
    expect(res.statusCode).toBe(200);
    expect(res.body.ciudad).toBe('Hermosillo');
    expect(res.body.temperatura).toBe(38);
  });
});
