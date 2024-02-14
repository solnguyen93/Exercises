import db from '../db.js';
import bcrypt from 'bcrypt';
import { sqlForPartialUpdate } from '../helpers/sql.js';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../expressError.js';

import { BCRYPT_WORK_FACTOR } from '../config.js';

/** Related functions for users. */

export default class User {
    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static async authenticate(username, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError('Invalid username/password');
    }

    /** Register user with data.
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register({ username, password, firstName, lastName, email, isAdmin }) {
        const duplicateCheck = await db.query(
            `SELECT username
           FROM users
           WHERE username = $1`,
            [username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
            [username, hashedPassword, firstName, lastName, email, isAdmin]
        );

        const user = result.rows[0];

        return user;
    }

    /** Find all users.
     *
     * Returns [{ username, first_name, last_name, email, is_admin }, ...]
     **/

    static async findAll() {
        const result = await db.query(
            `SELECT u.username,
                u.first_name AS "firstName",
                u.last_name AS "lastName",
                u.email,
                u.is_admin AS "isAdmin",
                CASE 
                    WHEN COUNT(j.id) = 0 THEN '0' 
                    ELSE json_agg(j.id) 
                END AS jobs
            FROM users u
            LEFT JOIN applications a ON u.username = a.username
            LEFT JOIN jobs j ON a.job_id = j.id
            GROUP BY u.username, u.first_name, u.last_name, u.email, u.is_admin
            ORDER BY u.username`
        );

        return result.rows;
    }

    /** Given a username, return data about user.
     *
     * Returns { username, first_name, last_name, is_admin, jobs }
     *   where jobs is { id, title, company_handle, company_name, state }
     *
     * Throws NotFoundError if user not found.
     **/

    static async get(username) {
        const userRes = await db.query(
            `SELECT u.username,
                u.first_name AS "firstName",
                u.last_name AS "lastName",
                u.email,
                u.is_admin AS "isAdmin",
                CASE 
                    WHEN COUNT(j.id) = 0 THEN '0' 
                    ELSE json_agg(json_build_object('id', j.id, 'title', j.title, 'salary', j.salary, 'equity', j.equity, 'companyHandle', j.company_handle))
                END AS jobs
            FROM users u
            LEFT JOIN applications a ON u.username = a.username
            LEFT JOIN jobs j ON a.job_id = j.id
            WHERE u.username = $1
            GROUP BY u.username, u.first_name, u.last_name, u.email, u.is_admin`,
            [username]
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return user;
    }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { firstName, lastName, password, email, isAdmin }
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password or make a user an admin.
     * Callers of this function must be certain they have validated inputs to this
     * or a serious security risks are opened.
     */

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(data, {
            firstName: 'first_name',
            lastName: 'last_name',
            isAdmin: 'is_admin',
        });
        const usernameVarIdx = '$' + (values.length + 1);

        const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }

    /** Delete given user from database; returns undefined. */

    static async remove(username) {
        let result = await db.query(
            `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
            [username]
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
    }

    /** Apply for a job with the given jobId.
     *
     * Throws NotFoundError if user or job not found.
     * Throws BadRequestError if user has already applied for job.
     */
    static async applyForJob(username, jobId) {
        // Check if the user exists
        const userRes = await db.query(
            `SELECT username
         FROM users
         WHERE username = $1`,
            [username]
        );
        const user = userRes.rows[0];
        if (!user) throw new NotFoundError(`User not found: ${username}`);

        // Check if the job exists
        const jobRes = await db.query(
            `SELECT id
         FROM jobs
         WHERE id = $1`,
            [jobId]
        );
        const job = jobRes.rows[0];
        if (!job) throw new NotFoundError(`Job not found: ${jobId}`);

        // Check if the user has already applied for this job
        const applicationRes = await db.query(
            `SELECT username, job_id
         FROM applications
         WHERE username = $1 AND job_id = $2`,
            [username, jobId]
        );
        const existingApplication = applicationRes.rows[0];
        if (existingApplication) {
            throw new BadRequestError(`User ${username} has already applied for job ${jobId}`);
        }

        // Insert the application
        await db.query(
            `INSERT INTO applications (username, job_id)
         VALUES ($1, $2)`,
            [username, jobId]
        );
    }
}
