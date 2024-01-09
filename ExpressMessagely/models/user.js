/** User class for message.ly */

import { BCRYPT_WORK_FACTOR } from '../config.js';
import db from '../db.js';
import bcrypt from 'bcrypt';
import ExpressError from '../expressError.js';

/** User of the site. */
class User {
    constructor({ username, password, first_name, last_name, phone, join_at, last_login_at }) {
        this.username = username;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.join_at = join_at;
        this.last_login_at = last_login_at;
    }
    /** register new user -- returns
     *    {username, password, first_name, last_name, phone}
     */
    static async register({ username, password, first_name, last_name, phone }) {
        try {
            const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
            const results = await db.query(
                `INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at) 
                VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp) 
                RETURNING username, password, first_name, last_name, phone`,
                [username, hashedPassword, first_name, last_name, phone]
            );
            return results.rows[0];
        } catch (e) {
            if (e.code === '23505') {
                throw new ExpressError('Username taken', 409);
            }
            throw e;
        }
    }

    /** Authenticate: is this username/password valid? Returns boolean. */
    static async authenticate(username, password) {
        const results = await db.query('SELECT password FROM users WHERE username = $1', [username]);
        const user = results.rows[0];
        if (user && (await bcrypt.compare(password, user.password))) {
            return true;
        }
    }

    /** Update last_login_at for user */
    static async updateLoginTimestamp(username) {
        try {
            const results = await db.query(
                `UPDATE users SET last_login_at = current_timestamp WHERE username = $1 RETURNING username, last_login_at`,
                [username]
            );
            return results.rows[0];
        } catch (e) {
            throw new ExpressError('Something went wrong', 500);
        }
    }

    /** All: basic info on all users:
     * [{username, first_name, last_name, phone}, ...] */
    static async all() {
        try {
            const results = await db.query(`SELECT username, first_name, last_name, phone FROM users`);
            return results.rows;
        } catch (e) {
            throw new ExpressError('Something went wrong', 500);
        }
    }

    /** Get: get user by username
     *
     * returns {username,
     *          first_name,
     *          last_name,
     *          phone,
     *          join_at,
     *          last_login_at }
     */

    static async get(username) {
        try {
            const results = await db.query(`SELECT username, first_name, last_name, phone, join_at, last_login_at FROM users WHERE username = $1`, [
                username,
            ]);
            if (!results.rows[0]) {
                throw new ExpressError('User not found', 404);
            }
            return results.rows[0];
        } catch (e) {
            throw new ExpressError('Something went wrong', 500);
        }
    }

    /** Return messages from this user.
     *
     * [{id, to_user, body, sent_at, read_at}]
     *
     * where to_user is
     *   {username, first_name, last_name, phone}
     */
    static async messagesFrom(username) {
        try {
            const result = await db.query(
                `SELECT m.id, m.to_username, u.first_name, u.last_name, u.phone, m.body, m.sent_at, m.read_at
                FROM messages AS m
                JOIN users AS u ON m.to_username = u.username
                WHERE m.from_username = $1
                ORDER BY m.sent_at DESC`,
                [username]
            );

            return result.rows.map((m) => ({
                id: m.id,
                to_user: {
                    username: m.to_username,
                    first_name: m.first_name,
                    last_name: m.last_name,
                    phone: m.phone,
                },
                body: m.body,
                sent_at: m.sent_at,
                read_at: m.read_at,
            }));
        } catch (e) {
            throw new ExpressError('Something went wrong', 500);
        }
    }

    /** Return messages to this user.
     *
     * [{id, from_user, body, sent_at, read_at}]
     *
     * where from_user is
     *   {username, first_name, last_name, phone}
     */
    static async messagesTo(username) {
        try {
            const result = await db.query(
                `SELECT m.id, m.from_username, u.first_name, u.last_name, u.phone, m.body, m.sent_at, m.read_at
                FROM messages AS m
                JOIN users AS u ON m.from_username = u.username
                WHERE m.to_username = $1
                ORDER BY m.sent_at DESC`,
                [username]
            );

            return result.rows.map((m) => ({
                id: m.id,
                from_user: {
                    username: m.from_username,
                    first_name: m.first_name,
                    last_name: m.last_name,
                    phone: m.phone,
                },
                body: m.body,
                sent_at: m.sent_at,
                read_at: m.read_at,
            }));
        } catch (e) {
            throw new ExpressError('Something went wrong', 500);
        }
    }
}

export default User;
