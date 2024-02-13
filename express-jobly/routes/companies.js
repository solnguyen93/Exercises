// 'use strict'; // Not needed in ESModule

/** Routes for companies. */

import * as jsonschema from 'jsonschema';
import express from 'express';

import { BadRequestError } from '../expressError.js';
import { ensureAdmin } from '../middleware/auth.js';
import Company from '../models/company.js';

import companyNewSchema from '../schemas/companyNew.json' with { type: 'json' };;
import companyUpdateSchema from '../schemas/companyUpdate.json' with { type: 'json' };;

const router = express.Router();

/** POST / { company } =>  { company }
 *
 * company should be { handle, name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: admin
 */

router.post('/', ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, companyNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const company = await Company.create(req.body);
        return res.status(201).json({ company });
    } catch (err) {
        return next(err);
    }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */



router.get('/', async function (req, res, next) {
  try {
      const supportedFilters = ['name', 'minEmployees', 'maxEmployees'];
      
      // Check for unsupported filters in the query parameters
      const unsupportedFilters = Object.keys(req.query).filter(param => !supportedFilters.includes(param));
      if (unsupportedFilters.length > 0) {
        throw new BadRequestError(`Unsupported filter(s): ${unsupportedFilters.join(', ')}`);
      }

      const minEmployees = req.query.hasOwnProperty('minEmployees') ? parseInt(req.query.minEmployees) : undefined;

      const maxEmployees = req.query.hasOwnProperty('maxEmployees') ? parseInt(req.query.maxEmployees) : undefined;

      const { name } = req.query || {};
      const companies = await Company.findAll({ name, minEmployees, maxEmployees });
      return res.json({ companies });
  } catch (err) {
      return next(err);
  }
});
/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get('/:handle', async function (req, res, next) {
    try {
        const company = await Company.get(req.params.handle);
        return res.json({ company });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: admin
 */

router.patch('/:handle', ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, companyUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const company = await Company.update(req.params.handle, req.body);
        return res.json({ company });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete('/:handle', ensureAdmin, async function (req, res, next) {
    try {
        await Company.remove(req.params.handle);
        return res.json({ deleted: req.params.handle });
    } catch (err) {
        return next(err);
    }
});

export default router;
