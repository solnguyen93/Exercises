import express from 'express';
import itemRoutes from './itemRoutes.js';
import { ExpressError } from './expressError.js';
import './fakeDb.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/items', itemRoutes);

// Middleware for handling requests that don't match any defined routes
app.use((req, res, next) => {
    const e = new ExpressError('Page Not Found', 404);
    next(e);
});

// Error handler middleware
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message || 'Internal Server Error';
    return res.status(status).json({
        error: { message, status },
    });
});

export default app;
