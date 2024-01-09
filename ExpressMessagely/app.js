/** Express app for message.ly. */

import express from 'express';
import cors from 'cors';
import { authenticateJWT } from './middleware/auth.js';
import ExpressError from './expressError.js';
import cookieParser from 'cookie-parser';

const app = express();

// Allow both form-encoded and json body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Allow connections to all routes from any browser
app.use(cors());

// Get auth token for all routes
app.use(authenticateJWT);

/** Routes */
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

/** 404 handler */
app.use(function (req, res, next) {
    const err = new ExpressError('Not Found', 404);
    return next(err);
});

/** General error handler */
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message || 'Internal Server Error';
    return res.status(status).json({
        error: { message, status },
    });
});

export default app;
