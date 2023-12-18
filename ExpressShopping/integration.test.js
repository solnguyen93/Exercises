import itemRoutes from './itemRoutes.js';
import { ExpressError } from './expressError.js';
import request from 'supertest';
import app from './app.js';
import './fakeDb.js';

process.env.NODE_ENV = 'test';

describe('Item Routes tests', () => {
    let item1 = { name: 'popsicle', price: 1.45 };
    let item2 = { name: 'cheerios', price: 3.4 };
    beforeEach(() => {
        items.push(item1);
        items.push(item2);
    });

    afterEach(function () {
        items.length = 0;
    });

    describe('GET /items', () => {
        test('Get all items', async () => {
            const res = await request(app).get('/items');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(items);
        });
    });

    describe('GET /items/:name', () => {
        test('Get a item', async () => {
            const res = await request(app).get(`/items/${items[0].name}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(items[0]);
        });
        test('Get a invalid item', async () => {
            const res = await request(app).get(`/items/kitkat`);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /items', () => {
        test('Creating a item', async () => {
            const res = await request(app).post('/items').send({ name: 'milk', price: 5.75 });
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({ message: `Successfuly added milk` });
        });
        test('Creating a item with invalid data', async () => {
            const res = await request(app).post('/items').send({});
            expect(res.statusCode).toBe(400);
        });
    });

    describe('PATCH /items/:name', () => {
        test('Updating a item', async () => {
            const res = await request(app).patch(`/items/${items[0].name}`).send({ name: 'ice-cream', price: 6.45 });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ name: 'ice-cream', price: 6.45 });
        });
        test('Updating a invalid item', async () => {
            const res = await request(app).patch(`/items/melon`).send({ name: 'mushroom' });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /items/:name', () => {
        test('Deleting a item', async () => {
            const res = await request(app).delete(`/items/${items[0].name}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Successfuly deleted ice-cream' });
        });
        test('Deleting a invalid item', async () => {
            const res = await request(app).delete(`/items/cheese`);
            expect(res.statusCode).toBe(404);
        });
    });
});

describe('404 Page Not Found', () => {
    test('Handling unknown route', async () => {
        const res = await request(app).get('/nonexistent-route');
        expect(res.statusCode).toBe(404);
        expect(res.body.error.message).toBe('Page Not Found');
        expect(res.body.error.status).toBe(404);
    });
});
