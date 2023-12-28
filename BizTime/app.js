/** BizTime express application. */

import express from 'express';
import ExpressError from './expressError.js';
import db from './db.js';
import companiesRouter from './companies.js';
import invoicesRouter from './invoices.js';

const app = express();

app.use(express.json());

app.use('/companies', companiesRouter);
app.use('/invoices', invoicesRouter);

/** 404 handler */
app.use((req, res, next) => {
    const e = new ExpressError('Page Not Found', 404);
    next(e);
});

/** general error handler */
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message || 'Internal Server Error';
    return res.status(status).json({
        error: { message, status },
    });
});

export default app;
