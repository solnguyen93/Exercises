import express from 'express';
import { calculateMean, calculateMedian, calculateMode } from './helper.js';
import { ExpressError } from './expressError.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check if 'nums' parameter is present
app.use(['/mean', '/median', '/mode', '/all'], (req, res, next) => {
    const numsQueryParam = req.query.nums;
    if (!numsQueryParam) {
        throw new ExpressError('Numbers must be provided in the "nums" query parameters', 400);
    }

    try {
        const parsedNums = numsQueryParam.split(',');
        // Check if there are non-numeric values in the array
        const nonNumericValues = parsedNums.filter((value) => isNaN(Number(value)));
        if (nonNumericValues.length > 0) {
            const errorSuffix = nonNumericValues.length === 1 ? 'value' : 'values';
            const separator = nonNumericValues.length === 1 ? ' ' : ', ';
            throw new ExpressError(`Invalid numeric values in the "nums" query parameter: ${nonNumericValues.join(', ')}`, 400);
        }
        // Convert the values to numbers after ensuring there are no non-numeric values
        const numericNums = parsedNums.map(Number);

        req.nums = numericNums;
        next();
    } catch (error) {
        next(error);
    }
});

// Route for calculating mean (average)
app.get('/mean', (req, res, next) => {
    try {
        const mean = calculateMean(req.nums);
        res.json({ operation: 'mean', result: mean });
    } catch (error) {
        next(error);
    }
});

// Route for calculating median (midpoint)
app.get('/median', (req, res, next) => {
    try {
        const median = calculateMedian(req.nums);
        res.json({ operation: 'median', result: median });
    } catch (error) {
        next(error);
    }
});

// Route for calculating mode (most frequent)
app.get('/mode', (req, res, next) => {
    try {
        const mode = calculateMode(req.nums);
        res.json({ operation: 'mode', result: mode });
    } catch (error) {
        next(error);
    }
});

// Route for calculating mean, median, and mode
app.get('/all', (req, res, next) => {
    try {
        const mean = calculateMean(req.nums);
        const median = calculateMedian(req.nums);
        const mode = calculateMode(req.nums);
        res.json({ operation: 'all', mean: mean, median: median, mode: mode });
    } catch (error) {
        next(error);
    }
});

// Middleware for handling requests that don't match any defined routes
app.use((req, res, next) => {
    // Creating a custom error for "Page Not Found" and passing it to the next function
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

const server = app.listen(3000, () => {
    console.log(`Server listening at http://localhost:3000`);
});

export default server;
