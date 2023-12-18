import express from 'express';
const router = express.Router();
import { ExpressError } from './expressError.js';

router.get('/', (req, res, next) => {
    try {
        res.json(items);
    } catch (err) {
        next(err);
    }
});

router.post('/', (req, res, next) => {
    try {
        const { name, price } = req.body;
        // Validate input data
        if (!name || typeof price !== 'number' || isNaN(price) || name.trim() === '') {
            throw new ExpressError('Invalid data format', 400);
        }
        items.push({ name, price });
        res.status(201).json({ message: `Successfuly added ${name}` });
    } catch (err) {
        next(err);
    }
});

router.get('/:name', (req, res, next) => {
    try {
        const { name } = req.params; // Longhand: const name = req.params.name;
        const item = items.find((item) => item.name === name);
        if (!item) {
            throw new ExpressError('Item not found', 404);
        }
        res.json(item);
    } catch (err) {
        next(err);
    }
});

router.patch('/:name', (req, res, next) => {
    try {
        const name = req.params.name;
        const itemIndex = items.findIndex((item) => item.name === name);
        if (itemIndex === -1) {
            throw new ExpressError('Item not found', 404);
        }
        items[itemIndex].name = req.body.name;
        items[itemIndex].price = req.body.price;
        res.json(items[itemIndex]);
    } catch (err) {
        next(err);
    }
});

router.delete('/:name', (req, res, next) => {
    try {
        const name = req.params.name;
        const itemIndex = items.findIndex((item) => item.name === name);
        if (itemIndex === -1) {
            throw new ExpressError('Item not found', 404);
        }
        items.splice(itemIndex, 1);
        res.json({ message: `Successfuly deleted ${name}` });
    } catch (err) {
        next(err);
    }
});

export default router;
