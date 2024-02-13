import db from '../db.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../expressError.js';
import { sqlForPartialUpdate } from '../helpers/sql.js';

/** Related functions for jobs. */

export default class Job {
    /** Create a job (from data), update db, return new job data.
     *
     * data should be { id, title, salary, salary, company_handle }
     *
     * Returns { id, title, salary, salary, company_handle }
     *
     * Throws BadRequestError if job already in database.
     * */

    static async create({ title, salary, equity, companyHandle }) {
        const duplicateCheck = await db.query(
            `SELECT *
           FROM jobs
           WHERE title = $1 
           AND salary = $2 
           AND equity = $3 
           AND company_handle = $4`,
            [title, salary, equity, companyHandle]
        );

        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate job`);

        const result = await db.query(
            `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity,
           company_handle AS "companyHandle"`,
            [title, salary, equity, companyHandle]
        );
        const job = result.rows[0];

        return job;
    }

    /** Given a job id, return data about job.
     *
     * Returns { id, title, salary, salary, company_handle, jobs }
     *   where jobs is [{ id, title, salary, equity, jobHandle }, ...]
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const jobRes = await db.query(
            `SELECT j.id,
                    j.title,
                    j.salary,
                    j.equity,
                    j.company_handle AS "companyHandle",
                    c.handle AS "companyHandle",
                    c.name,
                    c.description,
                    c.num_employees AS "numEmployees",
                    c.logo_url AS "logoUrl"
            FROM jobs AS j
            JOIN companies AS c ON j.company_handle = c.handle
            WHERE j.id = $1`,
            [id]
        );

        const job = jobRes.rows[0];

        if (!job) throw new NotFoundError(`No job: ${id}`);

        return {
            id: job.id,
            title: job.title,
            salary: job.salary,
            equity: job.equity,
            company: {
                handle: job.companyHandle,
                name: job.name,
            },
        };
    }

    /** Update job data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {title, salary, equity, companyHandle}
     *
     * Returns {id, title, salary, equity, companyHandle}
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {});
        // Check if 'id' or 'company_handle' fields are included in the data
        if ('id' in data || 'companyHandle' in data) {
            throw new BadRequestError("Updating 'id' or 'company handle' is not allowed.");
        }
        const idVarIdx = '$' + (values.length + 1);

        const querySql = `
            UPDATE jobs 
            SET ${setCols} 
            WHERE id = ${idVarIdx} 
            RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;
        const result = await db.query(querySql, [...values, id]);
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`No job found with id: ${id}`);

        return job;
    }

    /**
     * Find jobs based on optional filtering criteria.
     *
     * Returns an array of job objects matching the filtering criteria.
     *
     * @param {Object} options - Filtering options passed as query parameters.
     * @param {string} options.title - Job title to search for (optional).
     * @param {number} options.minSalary - Minimum salary of job (optional).
     * @param {boolean} options.hasEquity - Indicates if the job has equity (optional).
     * @returns {Promise<Array>} Array of jobs matching the filtering criteria.
     * @example
     * // Filter jobs by title containing 'tech' and having a salary of at least 100000
     * const jobs1 = await findAll({ title: 'tech', minSalary: 100000 });
     *
     * // Filter jobs having equity
     * const jobs2 = await findAll({ hasEquity: true });
     *
     * // Filter jobs by title containing 'software', minimum salary of 50000, and has equity
     * const jobs3 = await findAll({ title: 'software', minSalary: 50000, hasEquity: true });
     *
     * // Fetch all jobs without any specific criteria
     * const allJobs = await findAll({});
     */
    static async findAll({ title, minSalary, hasEquity } = {}) {
        // Initialize empty arrays whereConditions and values to hold the WHERE conditions and their corresponding values.
        const whereConditions = [];
        const values = [];

        // For each provided search parameter, push the appropriate condition into the whereConditions array and add its value into the values array.
        if (title) {
            values.push(title);
            whereConditions.push(`LOWER(title) LIKE '%' || LOWER($${values.length}) || '%'`);
        }
        if (minSalary) {
            values.push(minSalary);
            whereConditions.push(`salary >= $${values.length}`);
        }
        if (hasEquity === true) {
            whereConditions.push(`equity > 0`);
        }

        // Initialize the SQL query
        let sql = `SELECT id, title, salary, equity, company_handle AS "companyHandle" FROM jobs`;

        // Add WHERE clause if there are conditions
        if (whereConditions.length > 0) {
            sql += ' WHERE ' + whereConditions.join(' AND ');
        }

        // Add ORDER BY clause
        sql += ' ORDER BY title';

        // Execute the SQL query with the constructed WHERE clause and values
        const jobs = await db.query(sql, values);

        return jobs.rows;
    }

    /** Delete given job from database; returns undefined.
     *
     * Throws NotFoundError if job not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
            [id]
        );
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`No job with id: ${id}`);
    }
}
