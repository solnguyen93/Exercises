/** BizTime express application. */

import express from 'express';
import ExpressError from './expressError.js';
import db from './db.js';
import companiesRouter from './routes/companies.js';
import invoicesRouter from './routes/invoices.js';
import industriesRouter from './routes/industries.js';

const app = express();

app.use(express.json());

app.use('/companies', companiesRouter);
app.use('/invoices', invoicesRouter);
app.use('/industries', industriesRouter);

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
