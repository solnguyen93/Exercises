/** Database connection for messagely. */

import pkg from 'pg';
import dotenv from 'dotenv';
import { DB_URI } from './config.js';

dotenv.config();
const { Client } = pkg;

const db = new Client({
    user: process.env.DB_USER || 'your_username', // Update with your PostgreSQL username
    database: DB_URI,
    password: process.env.DB_PASSWORD || 'your_password', // Update with your PostgreSQL password
});

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch((error) => console.error('Error connecting to the database:', error));

export default db;
