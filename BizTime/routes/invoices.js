/** Routes for invoices. */

import express from 'express';
const invoicesRouter = express.Router();
import ExpressError from './../expressError.js';
import db from './../db.js';

/** GET /invoices - list of invoices. */
invoicesRouter.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code FROM invoices`);
        // Return info on invoices: like {invoices: [{id, comp_code}, ...]}
        return res.json({ invoices: results.rows });
    } catch (err) {
        return next(err);
    }
});

/** GET /invoices/[id] - obj of invoice and associated company. */
invoicesRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(
            `SELECT i.*, c.code, c.name, c.description
            FROM invoices i
            JOIN companies c ON i.comp_code = c.code
            WHERE i.id = $1`,
            [id]
        );
        if (!results.rows[0]) {
            throw new ExpressError('Invoice not found', 404);
        }
        const { amt, paid, add_date, paid_date, code, name, description } = results.rows[0];
        // Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}
        return res.json({
            invoice: {
                id,
                amt,
                paid,
                add_date,
                paid_date,
                company: {
                    code,
                    name,
                    description,
                },
            },
        });
    } catch (err) {
        next(err);
    }
});

/** POST /invoices - adds a invoice and return its values. */
invoicesRouter.post('/', async (req, res, next) => {
    try {
        // Needs to be passed in JSON body of: {comp_code, amt}
        const { comp_code, amt } = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`, [comp_code, amt]);
        // Returns obj of new invoice: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
        return res.status(201).json({ invoice: results.rows[0] });
    } catch (err) {
        next(err);
    }
});

/** PUT /invoices/[id] - edit existing invoice and return its new values. */
invoicesRouter.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const invoice = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
        if (!invoice.rows[0]) {
            throw new ExpressError('Invoice not found', 404);
        }
        // Needs to be passed in a JSON body of {amt, paid}
        const { amt, paid } = req.body;
        let paidDate;

        if (paid === true && !invoice.rows[0].paid) {
            paidDate = new Date();
        } else if (paid === false) {
            paidDate = null;
        } else {
            paidDate = invoice.rows[0].paid_date;
        }

        const updateInvoice = await db.query(`UPDATE invoices SET paid_date = $1, amt = $2, paid = $3 WHERE id = $4 RETURNING *`, [
            paidDate,
            amt,
            paid,
            id,
        ]);

        // Returns obj of edited invoice: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
        return res.json({ invoice: updateInvoice.rows[0] });
    } catch (err) {
        next(err);
    }
});

/** DELETE /invoices/[id] - delete existing invoice and return a JSON object with the status message */
invoicesRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const invoice = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
        if (!invoice.rows[0]) {
            throw new ExpressError('Invoice not found', 404);
        }
        await db.query(`DELETE FROM invoices WHERE id = $1`, [id]);
        res.json({ status: `Deleted` });
    } catch (err) {
        next(err);
    }
});

export default invoicesRouter;
