import request from 'supertest';
import db from '../db.js';
import app from '../app.js';
import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, adminToken } from './_testCommon.js';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */

describe('POST /companies', function () {
    const newCompany = {
        handle: 'new',
        name: 'New',
        logoUrl: 'http://new.img',
        description: 'DescNew',
        numEmployees: 10,
    };

    test('ok for admin', async function () {
        const resp = await request(app).post('/companies').send(newCompany).set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            company: newCompany,
        });
    });

    test('unauth for users', async function () {
        const resp = await request(app).post('/companies').send(newCompany).set('authorization', `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('bad request with missing data', async function () {
        const resp = await request(app)
            .post('/companies')
            .send({
                handle: 'new',
                numEmployees: 10,
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });

    test('bad request with invalid data', async function () {
        const resp = await request(app)
            .post('/companies')
            .send({
                ...newCompany,
                logoUrl: 'not-a-url',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** GET /companies */

describe('GET /companies', function () {
    test('ok for anon', async function () {
        const resp = await request(app).get('/companies');
        expect(resp.body).toEqual({
            companies: [
                {
                    handle: 'c1',
                    name: 'C1',
                    description: 'Desc1',
                    numEmployees: 1,
                    logoUrl: 'http://c1.img',
                },
                {
                    handle: 'c2',
                    name: 'C2',
                    description: 'Desc2',
                    numEmployees: 2,
                    logoUrl: 'http://c2.img',
                },
                {
                    handle: 'c3',
                    name: 'C3',
                    description: 'Desc3',
                    numEmployees: 3,
                    logoUrl: 'http://c3.img',
                },
                {
                    handle: 'c4',
                    name: 'C4',
                    description: 'Desc4',
                    numEmployees: 4,
                    logoUrl: 'http://c4.img',
                },
            ],
        });
    });

    test('fails: test next() handler', async function () {
        // there's no normal failure event which will cause this route to fail ---
        // thus making it hard to test that the error-handler works with it. This
        // should cause an error, all right :)
        await db.query('DROP TABLE companies CASCADE');
        const resp = await request(app).get('/companies').set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(500);
    });
});

describe('GET /companies with params', () => {
    it('should return a 400 error for unsupported filters', async () => {
        const response = await request(app).get('/companies').query({ invalidFilter: 'value' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toEqual({
            message: 'Unsupported filter(s): invalidFilter',
            status: 400,
        });
    });

    it('should return companies filtered by name', async () => {
        const response = await request(app).get('/companies').query({ name: 'inc' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('companies');
    });

    it('should return companies filtered by minimum number of employees', async () => {
        const response = await request(app).get('/companies').query({ minEmployees: 100 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('companies');
    });

    it('should return companies filtered by maximum number of employees', async () => {
        const response = await request(app).get('/companies').query({ maxEmployees: 500 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('companies');
    });

    it('should return companies filtered by name and range number of employees', async () => {
        const response = await request(app).get('/companies').query({ name: 'a', minEmployees: 100, maxEmployees: 12000 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('companies');
    });
});

/************************************** GET /companies/:handle */

describe('GET /companies/:handle', function () {
    test('works for anon', async function () {
        const resp = await request(app).get(`/companies/c1`);
        expect(resp.body).toEqual({
            company: {
                handle: 'c1',
                name: 'C1',
                description: 'Desc1',
                numEmployees: 1,
                logoUrl: 'http://c1.img',
                jobs: [
                    {
                        id: expect.any(Number),
                        title: 'C1Job',
                        salary: 125000,
                        equity: '0.10',
                    },
                ],
            },
        });
    });

    test('works for anon: company w/o jobs', async function () {
        const resp = await request(app).get(`/companies/c4`);
        expect(resp.body).toEqual({
            company: {
                handle: 'c4',
                name: 'C4',
                description: 'Desc4',
                numEmployees: 4,
                logoUrl: 'http://c4.img',
                jobs: [],
            },
        });
    });

    test('not found for no such company', async function () {
        const resp = await request(app).get(`/companies/nope`);
        expect(resp.statusCode).toEqual(404);
    });
});

/************************************** PATCH /companies/:handle */

describe('PATCH /companies/:handle', function () {
    test('works for admin', async function () {
        const resp = await request(app)
            .patch(`/companies/c1`)
            .send({
                name: 'C1-new',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.body).toEqual({
            company: {
                handle: 'c1',
                name: 'C1-new',
                description: 'Desc1',
                numEmployees: 1,
                logoUrl: 'http://c1.img',
            },
        });
    });

    test('unauth for users', async function () {
        const resp = await request(app)
            .patch(`/companies/c1`)
            .send({
                name: 'C1-new',
            })
            .set('authorization', `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('unauth for anon', async function () {
        const resp = await request(app).patch(`/companies/c1`).send({
            name: 'C1-new',
        });
        expect(resp.statusCode).toEqual(401);
    });

    test('not found on no such company', async function () {
        const resp = await request(app)
            .patch(`/companies/nope`)
            .send({
                name: 'new nope',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });

    test('bad request on handle change attempt', async function () {
        const resp = await request(app)
            .patch(`/companies/c1`)
            .send({
                handle: 'c1-new',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });

    test('bad request on invalid data', async function () {
        const resp = await request(app)
            .patch(`/companies/c1`)
            .send({
                logoUrl: 'not-a-url',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** DELETE /companies/:handle */

describe('DELETE /companies/:handle', function () {
    test('works for admin', async function () {
        const resp = await request(app).delete(`/companies/c1`).set('authorization', `Bearer ${adminToken}`);
        expect(resp.body).toEqual({ deleted: 'c1' });
    });

    test('unauth for users', async function () {
        const resp = await request(app).delete(`/companies/c1`).set('authorization', `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('unauth for anon', async function () {
        const resp = await request(app).delete(`/companies/c1`);
        expect(resp.statusCode).toEqual(401);
    });

    test('unauth: not found for no such company', async function () {
        const resp = await request(app).delete(`/companies/nope`).set('authorization', `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('auth: not found for no such company', async function () {
        const resp = await request(app).delete(`/companies/nope`).set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });
});
