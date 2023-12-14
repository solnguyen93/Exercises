import { calculateMean, calculateMedian, calculateMode } from './helper.js';
import { ExpressError } from './expressError.js';
import request from 'supertest';
import app from './app.js';

describe('Helper Functions', () => {
    const functionsToTest = [
        { func: calculateMean, name: 'calculateMean', expected: 20.2 },
        { func: calculateMedian, name: 'calculateMedian', expected: 5 },
        { func: calculateMode, name: 'calculateMode', expected: 1 },
    ];

    functionsToTest.forEach(({ func, name, expected }) => {
        describe(`${name} function`, () => {
            test('should calculate correctly', () => {
                const res = func([1, 24, 3, 68, 5]);
                expect(res).toEqual(expected);
            });
            test('should handle array with one element', () => {
                const res = func([1]);
                expect(res).toEqual(1);
            });
            test('should throw error when input is not an array', () => {
                const wrapperFunction = () => func(1, 1);
                expect(wrapperFunction).toThrowError('Invalid numeric values in the input array');
            });
            test('should throw error when input contains non-numeric values', () => {
                const wrapperFunction = () => func([1, 1, '@', 'B']);
                expect(wrapperFunction).toThrowError('Invalid numeric values in the input array');
            });
        });
    });
});

describe('App', () => {
    describe('404 Page Not Found', () => {
        test('should return 404 for an undefined route', async () => {
            const res = await request(app).get('/undefined-route');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: { message: 'Page Not Found', status: 404 } });
        });
    });

    const routesToTest = [
        { route: 'mean', expected: 17.33 },
        { route: 'median', expected: 4 },
        { route: 'mode', expected: 3 },
    ];

    routesToTest.forEach(({ route, expected }) => {
        describe(`GET /${route}`, () => {
            test(`should calculate ${route} correctly`, async () => {
                const res = await request(app).get(`/${route}?nums=1,24,3,3,68,5`);
                expect(res.status).toBe(200);
                expect(res.body).toEqual({ operation: route, result: expected });
            });
            test('should handle missing "nums" parameter', async () => {
                const res = await request(app).get(`/${route}`);
                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: { message: 'Numbers must be provided in the "nums" query parameters', status: 400 },
                });
            });
            test('should handle invalid numeric values', async () => {
                const res = await request(app).get(`/${route}?nums=1,a,3`);
                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: { message: `Invalid numeric values in the "nums" query parameter: a`, status: 400 },
                });
            });
        });
    });
});
