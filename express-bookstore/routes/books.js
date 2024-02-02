import express from 'express';
import Book from '../models/book.js';
import { validate } from 'jsonschema';
import bookSchemaNew from '../schema/bookSchemaNew.json' with { type: 'json' };
import bookSchemaUpdate from '../schema/bookSchemaUpdate.json' with { type: 'json' };


const router = express.Router();

/** GET / => {books: [book, ...]}  */
router.get('/', async (req, res, next) => {
    try {
        const books = await Book.findAll(req.query);
        return res.json({ books });
    } catch (err) {
        return next(err);
    }
});

/** GET /[id]  => {book: book} */
router.get('/:id', async (req, res, next) => {
    try {
        const book = await Book.findOne(req.params.id);
        return res.json({ book });
    } catch (err) {
        return next(err);
    }
});

/** POST /   bookData => {book: newBook}  */
router.post('/', async (req, res, next) => {
    try {
        const validation = validate(req.body, bookSchemaNew);
        if (!validation.valid) {
            const listOfErrors = validation.errors.map((e) => e.stack);
            return next({
                status: 400,
                message: 'Validation error',
                errors: listOfErrors,
            });
        }
        const book = await Book.create(req.body);
        return res.status(201).json({ book });
    } catch (err) {
      if (err.code === '23505') {
        // Handle unique violation error
        return next({
            status: 409,
            message: 'Book already exists',
        });
      } else {
        return next(err);
      }
    }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */
router.put('/:isbn', async (req, res, next) => {
    try {
        // Check if the book with the given ISBN exists in the database
        await Book.findOne(req.params.isbn);

        // Check if 'isbn' is being updated, and if so, throw an error
        if (req.body.isbn && req.body.isbn !== req.params.isbn) {
            return next({
                status: 400,
                message: 'Updating ISBN is not allowed',
            });
        }
        const validation = validate(req.body, bookSchemaUpdate);
        if (!validation.valid) {
            const listOfErrors = validation.errors.map((e) => e.stack);
            return next({
                status: 400,
                message: 'Validation error',
                errors: listOfErrors,
            });
        }
        const book = await Book.update(req.params.isbn, req.body);
        return res.status(200).json({ book });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */
router.delete('/:isbn', async (req, res, next) => {
    try {
        await Book.remove(req.params.isbn);
        return res.json({ message: 'Book deleted' });
    } catch (err) {
        return next(err);
    }
});

export default router;
