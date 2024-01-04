import request from 'supertest';
import db from './db.js';
import app from './app.js';

process.env.NODE_ENV = 'test';

beforeEach(async () => {
    await db.query(`
        DROP TABLE IF EXISTS invoices;
        DROP TABLE IF EXISTS companies;
        
        CREATE TABLE companies (
            code text PRIMARY KEY,
            name text NOT NULL UNIQUE,
            description text
        );
        
        CREATE TABLE invoices (
            id serial PRIMARY KEY,
            comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
            amt float NOT NULL,
            paid boolean DEFAULT false NOT NULL,
            add_date date DEFAULT CURRENT_DATE NOT NULL,
            paid_date date,
            CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
        );
        
        INSERT INTO companies
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
                ('ibm', 'IBM', 'Big blue.');
        
        INSERT INTO invoices (comp_code, amt, paid, paid_date)
        VALUES ('apple', 100, false, null),
                ('apple', 200, false, null),
                ('apple', 300, true, '2018-01-01'),
                ('ibm', 400, false, null);
    `);
});

afterEach(async () => {
    await db.query('DROP TABLE IF EXISTS invoices; DROP TABLE IF EXISTS companies;');
});

afterAll(async () => {
    await db.end();
});

describe('404 Page Not Found', () => {
    test('Handling unknown route', async () => {
        const res = await request(app).get('/nonexistent-route');
        expect(res.statusCode).toBe(404);
        expect(res.body.error.message).toBe('Page Not Found');
        expect(res.body.error.status).toBe(404);
    });
});

/** Companies test */
describe('Companies Routes tests', () => {
    describe('GET /companies', () => {
        test('Get all companies', async () => {
            const res = await request(app).get('/companies');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                companies: [
                    {
                        code: 'apple',
                        name: 'Apple Computer',
                        description: 'Maker of OSX.',
                    },
                    {
                        code: 'ibm',
                        name: 'IBM',
                        description: 'Big blue.',
                    },
                ],
            });
        });
    });
    describe('GET /companies/:name', () => {
        test('Get a company', async () => {
            const res = await request(app).get(`/companies/apple`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                company: {
                    code: 'apple',
                    name: 'Apple Computer',
                    description: 'Maker of OSX.',
                    invoices: {
                        id: 1,
                        amt: 100,
                        paid: false,
                        add_date: expect.any(String),
                        paid_date: null,
                    },
                },
            });
        });
        test('Get a invalid company', async () => {
            const res = await request(app).get(`/companies/kitkat`);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /companies', () => {
        test('Creating a company', async () => {
            const res = await request(app).post('/companies').send({
                name: 'Amazon',
                description: 'Test adding Amazon',
            });
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                company: {
                    code: 'amazon',
                    name: 'Amazon',
                    description: 'Test adding Amazon',
                },
            });
        });
        test('Creating a company with invalid data', async () => {
            const res = await request(app).post('/companies').send({});
            expect(res.statusCode).toBe(500);
        });
    });

    describe('PUT /companies/:name', () => {
        test('Edit a company', async () => {
            const res = await request(app).put(`/companies/apple`).send({
                name: 'mac',
                description: 'Test changing apple to mac',
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                company: {
                    code: 'apple',
                    name: 'mac',
                    description: 'Test changing apple to mac',
                },
            });
        });
        test('Edit a invalid company', async () => {
            const res = await request(app).put(`/companies/ebay`).send({ name: 'sephora' });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /companies/:name', () => {
        test('Deleting a company', async () => {
            const res = await request(app).delete(`/companies/apple`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ status: `Deleted` });
        });
        test('Deleting a invalid company', async () => {
            const res = await request(app).delete(`/companies/chase`);
            expect(res.statusCode).toBe(404);
        });
    });
});

/** Invoices test */
describe('Invoices Routes tests', () => {
    describe('GET /invoices', () => {
        test('Get all invoices', async () => {
            const res = await request(app).get('/invoices');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                invoices: [
                    {
                        id: 1,
                        comp_code: 'apple',
                    },
                    {
                        id: 2,
                        comp_code: 'apple',
                    },
                    {
                        id: 3,
                        comp_code: 'apple',
                    },
                    {
                        id: 4,
                        comp_code: 'ibm',
                    },
                ],
            });
        });
    });
    describe('GET /invoices/:id', () => {
        test('Get a invoice', async () => {
            const res = await request(app).get(`/invoices/1`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                invoice: {
                    id: '1',
                    amt: 100,
                    paid: false,
                    add_date: expect.any(String),
                    paid_date: null,
                    company: {
                        code: 'apple',
                        name: 'Apple Computer',
                        description: 'Maker of OSX.',
                    },
                },
            });
        });
        test('Get a invalid invoice', async () => {
            const res = await request(app).get(`/invoices/99`);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /invoices', () => {
        test('Creating a invoice', async () => {
            const res = await request(app).post('/invoices').send({
                comp_code: 'apple',
                amt: 500,
            });
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                invoice: {
                    id: 5,
                    comp_code: 'apple',
                    amt: 500,
                    paid: false,
                    add_date: '2024-01-01T08:00:00.000Z',
                    paid_date: null,
                },
            });
        });
        test('Creating a invoice with invalid data', async () => {
            const res = await request(app).post('/invoices').send({});
            expect(res.statusCode).toBe(500);
        });
    });

    describe('PUT /invoices/:id', () => {
        test('Edit a invoice', async () => {
            const res = await request(app).put(`/invoices/1`).send({
                amt: 99,
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                invoice: {
                    id: 1,
                    comp_code: 'apple',
                    amt: 99,
                    paid: false,
                    add_date: '2024-01-01T08:00:00.000Z',
                    paid_date: null,
                },
            });
        });
        test('Edit a invalid invoice', async () => {
            const res = await request(app).put(`/invoices/99`).send({ amt: 99 });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /invoices/:id', () => {
        test('Deleting a invoice', async () => {
            const res = await request(app).delete(`/invoices/1`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ status: `Deleted` });
        });
        test('Deleting a invalid invoice', async () => {
            const res = await request(app).delete(`/invoices/99`);
            expect(res.statusCode).toBe(404);
        });
    });
});
