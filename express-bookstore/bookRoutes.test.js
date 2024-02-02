process.env.NODE_ENV = 'test';
import db from './db.js';
import request from 'supertest';
import app from './app.js';
import Book from './models/book.js';

describe('Book Routes Test', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM books');

        // Assuming you have a Book model with a create method
        const book1 = await Book.create({
            isbn: '1234567890',
            amazon_url: 'https://www.amazon.com/example-book',
            author: 'John Author',
            language: 'English',
            pages: 300,
            publisher: 'Publisher XYZ',
            title: 'The Example Book',
            year: 2023,
        });
    });

    describe('POST /books', () => {
        test('can add new book', async () => {
            const response = await request(app).post('/books').send({
                isbn: '11111111',
                amazon_url: 'https://www.amazon.com/example-book',
                author: 'John Author',
                language: 'English',
                pages: 300,
                publisher: 'Publisher XYZ',
                title: 'The Example Book',
                year: 2023,
            });

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('book');
        });

        test('can not add new book with missing data', async () => {
            const response = await request(app).post('/books').send({
                isbn: '2222222222',
                amazon_url: 'https://www.amazon.com/example-book2',
                // Missing some required fields (author)
                language: 'English',
                pages: 300,
                publisher: 'Publisher ABC',
                // Missing some required fields (title)
                year: 2023,
            });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('can not add same book', async () => {
            const response = await request(app).post('/books').send({
                isbn: '1234567890',
                amazon_url: 'https://www.amazon.com/example-book',
                author: 'John Author',
                language: 'English',
                pages: 300,
                publisher: 'Publisher XYZ',
                title: 'The Example Book',
                year: 2023,
            });

            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('error.message', 'Book already exists');
        });
    });

    describe('PUT /books/:isbn', () => {
        test('can update book', async () => {
            const response = await request(app).put('/books/1234567890').send({
                title: 'The Updated Title',
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('book');
        });

        test('can not update isbn', async () => {
            const response = await request(app).put('/books/1234567890').send({
                isbn: '3333333333',
            });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('can not update with missing data', async () => {
            const response = await request(app).put('/books/1234567890').send({
                // Missing data (at least 1 field is required)
            });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /books', () => {
        test('can get all books', async () => {
            const response = await request(app).get('/books');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('books');
        });
    });

    describe('GET /books/:isbn', () => {
        test('can get book based on ISBN', async () => {
            const response = await request(app).get('/books/1234567890');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('book');
            expect(response.body.book.isbn).toBe('1234567890');
        });

        test('returns 404 for non-existent ISBN', async () => {
            const response = await request(app).get('/books/9999999999');

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('DELETE /books/:isbn', () => {
        test('can delete book based on ISBN', async () => {
            const response = await request(app).delete('/books/1234567890');

            expect(response.statusCode).toBe(200);
        });

        test('returns 404 for non-existent ISBN during delete', async () => {
            const response = await request(app).delete('/books/9999999999');

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    afterAll(async () => {
        await db.end();
    });
});
