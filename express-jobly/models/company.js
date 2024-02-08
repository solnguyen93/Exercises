import db from '../db.js';
import { BadRequestError, NotFoundError } from '../expressError.js';
import { sqlForPartialUpdate } from '../helpers/sql.js';

/** Related functions for companies. */

export default class Company {
    /** Create a company (from data), update db, return new company data.
     *
     * data should be { handle, name, description, numEmployees, logoUrl }
     *
     * Returns { handle, name, description, numEmployees, logoUrl }
     *
     * Throws BadRequestError if company already in database.
     * */

    static async create({ handle, name, description, numEmployees, logoUrl }) {
        const duplicateCheck = await db.query(
            `SELECT handle
           FROM companies
           WHERE handle = $1`,
            [handle]
        );

        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate company: ${handle}`);

        const result = await db.query(
            `INSERT INTO companies
           (handle, name, description, num_employees, logo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
            [handle, name, description, numEmployees, logoUrl]
        );
        const company = result.rows[0];

        return company;
    }

    /**
     * Find companies based on optional filtering criteria.
     *
     * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
     *
     * @param {Object} options - Filtering options passed as query parameters.
     * @param {string} options.name - Company name to search for (optional).
     * @param {number} options.minEmployees - Minimum number of employees (optional).
     * @param {number} options.maxEmployees - Maximum number of employees (optional).
     * @returns {Promise<Array>} Array of companies matching the filtering criteria.
     * @throws {Error} If minEmployees is greater than maxEmployees.
     * @example
     * // Filter companies by name containing 'tech' and having at least 100 employees
     * const companies1 = await findAll({ name: 'tech', minEmployees: 100 });
     *
     * // Filter companies having no more than 50 employees
     * const companies2 = await findAll({ maxEmployees: 50 });
     *
     * // Filter companies with a specific name and employee range
     * const companies3 = await findAll({ name: 'software', minEmployees: 50, maxEmployees: 200 });
     *
     * // Fetch all companies without any specific criteria
     * const allCompanies = await findAll({});
     */
    static async findAll({ name, minEmployees, maxEmployees } = {}) {
        // Validate minEmployees and maxEmployees
        if (minEmployees && maxEmployees && minEmployees > maxEmployees) {
            throw new Error('minEmployees cannot be greater than maxEmployees');
        }

        // Initialize an empty array to hold the WHERE conditions
        const whereConditions = [];

        // Add WHERE conditions based on the provided query parameters
        let placeholderIndex = 1; // Initialize the placeholder index
        if (name) {
            // Add condition to search for the provided name substring in company names (case-insensitive)
            whereConditions.push(`LOWER(name) LIKE '%' || LOWER($${placeholderIndex}) || '%'`); // example: ?name=tech  sql = WHERE name LIKE %$1%
            placeholderIndex++;
        }
        if (minEmployees) {
            // Add condition to filter companies with at least the specified number of employees
            whereConditions.push(`num_employees >= $${placeholderIndex}`);
            placeholderIndex++;
        }
        if (maxEmployees) {
            // Add condition to filter companies with no more than the specified number of employees
            whereConditions.push(`num_employees <= $${placeholderIndex}`);
            placeholderIndex++;
        }

        // Initialize the SQL query
        let sql = `SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl" FROM companies`;

        // Add WHERE clause if there are conditions
        if (whereConditions.length > 0) {
            sql += ' WHERE ' + whereConditions.join(' AND ');
        }

        // Add ORDER BY clause
        sql += ' ORDER BY name';

        // Execute the SQL query with the constructed WHERE clause and values
        const companies = await db.query(sql, [name, minEmployees, maxEmployees].filter(Boolean));

        return companies.rows;
    }

    /** Given a company handle, return data about company.
     *
     * Returns { handle, name, description, numEmployees, logoUrl, jobs }
     *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
     *
     * Throws NotFoundError if not found.
     **/

    static async get(handle) {
        const companyRes = await db.query(
            `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`,
            [handle]
        );

        const company = companyRes.rows[0];

        if (!company) throw new NotFoundError(`No company: ${handle}`);

        return company;
    }

    /** Update company data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {name, description, numEmployees, logoUrl}
     *
     * Returns {handle, name, description, numEmployees, logoUrl}
     *
     * Throws NotFoundError if not found.
     */

    static async update(handle, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            numEmployees: 'num_employees',
            logoUrl: 'logo_url',
        });
        const handleVarIdx = '$' + (values.length + 1);

        const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`;
        const result = await db.query(querySql, [...values, handle]);
        const company = result.rows[0];

        if (!company) throw new NotFoundError(`No company: ${handle}`);

        return company;
    }

    /** Delete given company from database; returns undefined.
     *
     * Throws NotFoundError if company not found.
     **/

    static async remove(handle) {
        const result = await db.query(
            `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
            [handle]
        );
        const company = result.rows[0];

        if (!company) throw new NotFoundError(`No company: ${handle}`);
    }
}