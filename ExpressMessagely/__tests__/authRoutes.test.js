import request from 'supertest';
import jwt from 'jsonwebtoken';
import db from '../db';
import User from '../models/user';
import app from '../app';

describe('Auth Routes Test', () => {
    beforeEach(async () => {
        await db.query('DELETE FROM messages');
        await db.query('DELETE FROM users');

        const u1 = await User.register({
            username: 'test1',
            password: 'password',
            first_name: 'Test1',
            last_name: 'Testy1',
            phone: '+14155550000',
        });
    });

    /** POST /auth/register => token  */

    describe('POST /auth/register', () => {
        test('can register', async () => {
            const response = await request(app).post('/auth/register').send({
                username: 'bob',
                password: 'secret',
                first_name: 'Bob',
                last_name: 'Smith',
                phone: '+14150000000',
            });

            const token = response.body.token;
            expect(jwt.decode(token)).toEqual({
                username: 'bob',
                iat: expect.any(Number),
            });
        });
    });

    /** POST /auth/login => token  */

    describe('POST /auth/login', () => {
        test('can login', async () => {
            const response = await request(app).post('/auth/login').send({ username: 'test1', password: 'password' });

            const token = response.body.token;
            expect(jwt.decode(token)).toEqual({
                username: 'test1',
                iat: expect.any(Number),
            });
        });

        test("won't login w/wrong password", async () => {
            const response = await request(app).post('/auth/login').send({ username: 'test1', password: 'WRONG' });
            expect(response.statusCode).toEqual(400);
        });

        test("won't login w/wrong password", async () => {
            const response = await request(app).post('/auth/login').send({ username: 'not-user', password: 'password' });
            expect(response.statusCode).toEqual(400);
        });
    });

    afterAll(async () => {
        await db.end();
    });
});
