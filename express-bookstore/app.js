/** Express app for bookstore. */
import express from 'express';
import { json } from 'express';
import ExpressError from './expressError.js';
import bookRoutes from './routes/books.js';
import { validate } from 'jsonschema';

const app = express();

app.use(json());

// Your application code using bookSchema
// ...

// For example, you can use the schema in a validation function
// const validateBookData = (data, req, res, next) => {
//     // Validation logic using bookSchema
//     // ...
// };

// // Use the schema to validate some data
// const testData = {
//     isbn: '978-0-123456-78-9',
//     // ... other data
// };

// if (validateBookData(testData)) {
//     console.log('Book data is valid.');
// } else {
//     console.error('Validation errors.');
// }

app.use('/books', bookRoutes);

/** 404 handler */
app.use((req, res, next) => {
    const err = new ExpressError('Not Found', 404);
    return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err,
    });
});

export default app;
