/** Routes for industries. */

import express from 'express';
const industriesRouter = express.Router();
import ExpressError from './../expressError.js';
import db from './../db.js';

/** GET /industries - list of industries with their assoicated companies. */
industriesRouter.get('/', async (req, res, next) => {
    try {
        // Fetch all industries
        const industriesResults = await db.query(`SELECT code AS industry_code, industry FROM industries`);
        const industries = industriesResults.rows;

        // For each industry, fetch associated companies
        for (const industry of industries) {
            const companiesResults = await db.query(
                `SELECT comp_code AS company_code, name
                FROM company_industries ci
                JOIN companies c ON ci.comp_code = c.code
                WHERE industry_code = $1`,
                [industry.industry_code]
            );
            industry.companies = companiesResults.rows.map((row) => row.name);
        }

        return res.json({ Industries: industries });
    } catch (err) {
        return next(err);
    }
});

/** POST /industries - adds a industry and return its values. */
industriesRouter.post('/', async (req, res, next) => {
    try {
        const { code, industry } = req.body;
        const results = await db.query(`INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *`, [code, industry]);
        return res.status(201).json({ industry: results.rows[0] });
    } catch (err) {
        next(err);
    }
});

/** POST /associate - associate an industry to a company. */
industriesRouter.post('/associate', async (req, res, next) => {
    try {
        const { companyCode, industryCode } = req.body;

        // Check if the company and industry exist
        const companyExists = await db.query(`SELECT * FROM companies WHERE code = $1`, [companyCode]);
        const industryExists = await db.query(`SELECT * FROM industries WHERE code = $1`, [industryCode]);

        if (!companyExists.rows[0] || !industryExists.rows[0]) {
            throw new ExpressError('Company or industry not found', 404);
        }

        // Check if the association already exists
        const existingAssociation = await db.query(
            `SELECT * FROM company_industries 
            WHERE comp_code = $1 AND industry_code = $2`,
            [companyCode, industryCode]
        );

        if (existingAssociation.rows.length > 0) {
            throw new ExpressError('Association already exists', 400);
        }

        // Create the association
        await db.query(
            `INSERT INTO company_industries (comp_code, industry_code) 
            VALUES ($1, $2)`,
            [companyCode, industryCode]
        );

        return res.status(201).json({ message: 'Association created successfully' });
    } catch (err) {
        return next(err);
    }
});

export default industriesRouter;
