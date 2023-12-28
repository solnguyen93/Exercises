/** Database setup for BizTime. */

import { Client } from 'pg';

let DB_URI;

if (process.env.NODE_ENV === 'test') {
    DB_URI = 'postgresql://biztime_test';
} else {
    DB_URI = 'postgresql://biztime';
}

const db = new Client({
    connectionString: DB_URI,
});

db.connect();

export default db;
