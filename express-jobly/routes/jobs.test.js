import request from 'supertest';
import db from '../db.js';
import app from '../app.js';

import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, adminToken, testJobIds } from './_testCommon.js';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe('POST /jobs', function () {
    const newJob = {
        title: 'NewJob',
        salary: 2000,
        equity: 0.25,
        companyHandle: 'c1',
    };

    test('ok for admin', async function () {
        const resp = await request(app).post('/jobs').send(newJob).set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(201);
    });

    test('unauth for users', async function () {
        const resp = await request(app).post('/jobs').send(newJob).set('authorization', `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('bad request with missing data', async function () {
        const resp = await request(app).post('/jobs').send({}).set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });

    test('bad request with invalid data', async function () {
        const resp = await request(app)
            .post('/jobs')
            .send({
                title: 'NewJob',
                salary: 'not-a-number',
                equity: 0.25,
                companyHandle: 'c1',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** GET /jobs */

describe('GET /jobs', function () {
    test('ok for anon', async function () {
        const resp = await request(app).get('/jobs');
        expect(resp.body).toEqual({
            jobs: [
                {
                    id: expect.any(Number),
                    title: 'C1Job',
                    salary: 125000,
                    equity: '0.10',
                    companyHandle: 'c1',
                },
                {
                    id: expect.any(Number),
                    title: 'C2Job',
                    salary: 234,
                    equity: '0.09',
                    companyHandle: 'c2',
                },
                {
                    id: expect.any(Number),
                    title: 'C3Job',
                    salary: 59000,
                    equity: '0.54',
                    companyHandle: 'c3',
                },
            ],
        });
    });

    test('fails: test next() idr', async function () {
        // there's no normal failure event which will cause this route to fail ---
        // thus making it hard to test that the error-idr works with it. This
        // should cause an error, all right :)
        await db.query('DROP TABLE jobs CASCADE');
        const resp = await request(app).get('/jobs').set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(500);
    });
});

describe('GET /jobs with params', () => {
    test('should return a 400 error for unsupported filters', async () => {
        const response = await request(app).get('/jobs').query({ invalidFilter: 'value' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toEqual({
            message: 'Unsupported filter(s): invalidFilter',
            status: 400,
        });
    });

    test('should return jobs filtered by title', async () => {
        const response = await request(app).get('/jobs').query({ title: 'jo' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('jobs');
    });

    test('should return jobs filtered by minimum salary', async () => {
        const response = await request(app).get('/jobs').query({ minSalary: 100 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('jobs');
    });

    test('should return jobs filtered by title, salary, and has equity', async () => {
        const response = await request(app).get('/jobs').query({ title: 'j', minSalary: 100, hasEquity: true });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('jobs');
    });
});

// /************************************** GET /jobs/:id */

describe('GET /jobs/:id', function () {
    test('works for anon', async function () {
        const resp = await request(app).get(`/jobs/${testJobIds[0]}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            job: {
                id: expect.any(Number),
                title: 'C1Job',
                salary: 125000,
                equity: '0.10',
                company: {
                    handle: 'c1',
                    name: 'C1',
                },
            },
        });
    });

    test('not found for no such job', async function () {
        const resp = await request(app).get(`/jobs/123456`);
        expect(resp.statusCode).toEqual(404);
    });
});

// /************************************** PATCH /jobs/:id */

describe('PATCH /jobs/:id', function () {
    test('works for admin', async function () {
        const resp = await request(app)
            .patch(`/jobs/${testJobIds[0]}`)
            .send({
                title: 'C1-newJobTitle',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.body).toEqual({
            job: {
                id: expect.any(Number),
                title: 'C1-newJobTitle',
                salary: 125000,
                equity: '0.10',
                companyHandle: 'c1',
            },
        });
    });

    test('unauth for users', async function () {
        const resp = await request(app)
            .patch(`/jobs/${testJobIds[0]}`)
            .send({
                title: 'C1-new',
            })
            .set('authorization', `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('unauth for anon', async function () {
        const resp = await request(app).patch(`/jobs/${testJobIds[0]}`).send({
            title: 'C1-new',
        });
        expect(resp.statusCode).toEqual(401);
    });

    test('not found on no such job', async function () {
        const resp = await request(app)
            .patch(`/jobs/123456`)
            .send({
                title: 'new nope',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });

    test('bad request on id change attempt', async function () {
        const resp = await request(app)
            .patch(`/jobs/${testJobIds[0]}`)
            .send({
                id: 'c1-new',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });

    test('bad request on invalid data', async function () {
        const resp = await request(app)
            .patch(`/jobs/${testJobIds[0]}`)
            .send({
                salary: 'not-a-url',
            })
            .set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });
});

// /************************************** DELETE /jobs/:id */

describe('DELETE /jobs/:id', function () {
    test('works for admin', async function () {
        const resp = await request(app).delete(`/jobs/${testJobIds[0]}`).set('authorization', `Bearer ${adminToken}`);
        expect(resp.body).toEqual({ deleted: `${testJobIds[0]}` });
    });

    test('unauth for users', async function () {
        const resp = await request(app).delete(`/jobs/${testJobIds[0]}`).set('authorization', `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('unauth for anon', async function () {
        const resp = await request(app).delete(`/jobs/${testJobIds[0]}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('unauth: not found for no such job', async function () {
        const resp = await request(app).delete(`/jobs/123456`).set('authorization', `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test('auth: not found for no such job', async function () {
        const resp = await request(app).delete(`/jobs/123456`).set('authorization', `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });
});
