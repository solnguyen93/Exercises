/** Routes for jobs. */

import * as jsonschema from 'jsonschema';
import express from 'express';

import { BadRequestError } from '../expressError.js';
import { ensureAdmin } from '../middleware/auth.js';
import Job from '../models/job.js';

import jobNewSchema from '../schemas/jobNew.json' with { type: 'json' };
import jobUpdateSchema from '../schemas/jobUpdate.json' with { type: 'json' };

const router = express.Router();

/** POST / { job } =>  { job }
 *
 * job should be { id, title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.post('/', ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, companyHandle }, ...] }
 *
 * Can filter on provided search filters:
 * - minSalary
 * - hasEquity
 * - titleLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get('/', async function (req, res, next) {
  try {
    const supportedFilters = ['title', 'minSalary', 'hasEquity'];
    
    // Check for unsupported filters in the query parameters
    const unsupportedFilters = Object.keys(req.query).filter(param => !supportedFilters.includes(param));
    if (unsupportedFilters.length > 0) {
      throw new BadRequestError(`Unsupported filter(s): ${unsupportedFilters.join(', ')}`);
    }

    // Check if minSalary parameter is present in the query. If true convert to int else undefined
    const minSalary = req.query.hasOwnProperty('minSalary') ? parseInt(req.query.minSalary) : undefined;

    // Check if hasEquity parameter is present in the query. If exist set to true else false
    const hasEquity = 'hasEquity' in req.query;

    const { title } = req.query || {};
    const jobs = await Job.findAll({ title, minSalary, hasEquity });
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
    const q = req.query;
    // arrive as strings from querystring, but we want as int/bool
    if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
    q.hasEquity = q.hasEquity === "true";
  
    try {

        console.log(hasEquity);
        console.log('hasEquity parameter:', req.query.hasEquity);
  
      const jobs = await Job.findAll(q);
      return res.json({ jobs });
    } catch (err) {
      return next(err);
    }
  });

/** GET /[id]  =>  { job }
 *
 *  Job is { id, title, salary, equity, companyHandle }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get('/:id', async function (req, res, next) {
    try {
        const job = await Job.get(req.params.id);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[id] { fld1, fld2, ... } => { job }
 *
 * Patches job data.
 *
 * fields can be: { title, salary, equity, logo_url }
 *
 * Returns { id, title, salary, equity, logo_url }
 *
 * Authorization required: admin
 */

router.patch('/:id', ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete('/:id', ensureAdmin, async function (req, res, next) {
    try {
        await Job.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

export default router;
