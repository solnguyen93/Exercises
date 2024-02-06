/** Database setup for jobly. */
import pkg from 'pg';
import { getDatabaseUri } from './config.js';

let db;

if (process.env.NODE_ENV === 'production') {
    db = new pkg.Client({
        connectionString: getDatabaseUri(),
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {
    db = new pkg.Client({
        connectionString: getDatabaseUri(),
    });
}

db.connect();

export default db;
