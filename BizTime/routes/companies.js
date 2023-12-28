/** Routes for companies. */

import express from 'express';
const companiesRouter = express.Router();
import ExpressError from './../expressError.js';
import db from './../db.js';

/** GET /companies - list of companies. */
companiesRouter.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        // Returns list of companies, like {companies: [{code, name}, ...]}
        return res.json({ companies: results.rows });
    } catch (err) {
        return next(err);
    }
});

/** GET /companies/[code] - obj of company and associated invoices. */
companiesRouter.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(
            `SELECT c.*, i.*
            FROM companies c
            LEFT JOIN invoices i ON c.code = i.comp_code
            WHERE c.code = $1`,
            [code]
        );
        if (!results.rows[0]) {
            throw new ExpressError('Company not found', 404);
        }
        const { name, description, id, amt, paid, add_date, paid_date } = results.rows[0];
        // Returns {company: {code, name, description, invoices: [id, ...]}}
        return res.json({
            company: {
                code,
                name,
                description,
                invoices: {
                    id,
                    amt,
                    paid,
                    add_date,
                    paid_date,
                },
            },
        });
    } catch (err) {
        next(err);
    }
});

/** POST /companies - adds a company and return its values. */
companiesRouter.post('/', async (req, res, next) => {
    try {
        // Needs to be given JSON like: {code, name, description}
        const { code, name, description } = req.body;
        const results = await db.query(`INSERT INTO companies VALUES ($1, $2, $3) RETURNING *`, [code, name, description]);
        // Returns obj of new company: {company: {code, name, description}}
        return res.json({ company: results.rows[0] });
    } catch (err) {
        next(err);
    }
});

/** PUT /companies/[code] - edit existing company and return its new values. */
companiesRouter.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const company = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        if (!company.rows[0]) {
            throw new ExpressError('Company not found', 404);
        }
        // Needs to be given JSON like: {name, description}
        const { name, description } = req.body;
        const results = await db.query(`UPDATE companies SET name = $2, description = $3 WHERE code = $1 RETURNING *`, [code, name, description]);
        // Returns obj of edited company: {company: {code, name, description}}
        return res.json({ company: results.rows[0] });
    } catch (err) {
        next(err);
    }
});

/** DELETE /companies/[code] - delete existing company and return a JSON object with the status message */
companiesRouter.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const company = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        if (!company.rows[0]) {
            throw new ExpressError('Company not found', 404);
        }
        await db.query(`DELETE FROM companies WHERE code = $1`, [code]);
        res.json({ status: `Deleted` });
    } catch (err) {
        next(err);
    }
});

export default companiesRouter;
