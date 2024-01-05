/** Database for lunchly */

import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Client } = pkg;

const DB_NAME = process.env.NODE_ENV === 'test' ? 'lunchly_test' : process.env.DB_NAME || 'lunchly';

const db = new Client({
    user: process.env.DB_USER || 'your_username', // Update with your PostgreSQL username
    database: DB_NAME,
    password: process.env.DB_PASSWORD || 'your_password', // Update with your PostgreSQL password
});

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch((error) => console.error('Error connecting to the database:', error));

export default db;
