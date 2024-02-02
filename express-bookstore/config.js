/** Common config for bookstore. */
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.NODE_ENV === 'test' ? 'book_test' : 'book';

export { DB_URI };
