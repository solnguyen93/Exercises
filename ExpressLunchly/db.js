/** Database for lunchly */

import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Client } = pkg;

let DB_NAME;

if (process.env.NODE_ENV === 'test') {
    DB_NAME = 'lunchly_test';
} else {
    DB_NAME = 'lunchly';
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
