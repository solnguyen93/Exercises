/** Common config for message.ly */

import dotenv from 'dotenv';

// Read .env files and make environmental variables
dotenv.config();

const DB_URI = process.env.NODE_ENV === 'test' ? 'messagely_test' : 'messagely';

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

const BCRYPT_WORK_FACTOR = 12;

export { DB_URI, SECRET_KEY, BCRYPT_WORK_FACTOR };
