/** Database setup for BizTime. */

import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Client } = pkg;

let DB_NAME;

if (process.env.NODE_ENV === 'test') {
    DB_NAME = 'biztime_test';
} else {
    DB_NAME = 'biztime';
}

const db = new Client({
    user: process.env.DB_USER || 'your_username', // Update with your PostgreSQL username
    database: DB_NAME || 'your_database_name', // Update with your database name
    password: process.env.DB_PASSWORD || 'your_password', // Update with your PostgreSQL password
});

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch((error) => console.error('Error connecting to the database:', error));

export default db;

/** DOESN'T WORK */

// import pkg from 'pg';

// const { Client } = pkg;

// let DB_URI;

// if (process.env.NODE_ENV === 'test') {
//     DB_URI = 'postgresql:///biztime_test';
// } else {
//     DB_URI = 'postgresql:///biztime';
// }

// const db = new Client({
//     connectionString: DB_URI,
// });

// db.connect()
//     .then(() => console.log('Connected to the database'))
//     .catch((error) => console.error('Error connecting to the database:', error));

// export default db;
