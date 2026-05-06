const request = require('supertest');
const app = require('../server');

// AC-5: Unauthenticated dashboard access redirects to login
test('AC-5: GET /admin/dashboard redirects unauthenticated to /admin/login', async () => {
    const res = await request(app).get('/admin/dashboard');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin/login');
});

// AC-6: Login page loads successfully
test('AC-6: GET /admin/login returns 200', async () => {
    const res = await request(app).get('/admin/login');
    expect(res.statusCode).toBe(200);
});

// AC-7: Invalid inquiry POST returns 400
test('AC-7: POST /api/inquiries with missing fields returns 400', async () => {
    const res = await request(app)
        .post('/api/inquiries')
        .send({ name: '', email: 'notanemail', guestType: 'invalid' });
    expect(res.statusCode).toBe(400);
});