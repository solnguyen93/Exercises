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
    database: DB_NAME,
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


Server listening at http://localhost:3000
Error connecting to the database: Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
    at Object.continueSession (/home/solnguyen93/Springboard/EXERCISES/BizTime/node_modules/pg/lib/crypto/sasl.js:24:11)
    at Client._handleAuthSASLContinue (/home/solnguyen93/Springboard/EXERCISES/BizTime/node_modules/pg/lib/client.js:272:18)
    at Connection.emit (node:events:514:28)
    at /home/solnguyen93/Springboard/EXERCISES/BizTime/node_modules/pg/lib/connection.js:117:12
    at Parser.parse (/home/solnguyen93/Springboard/EXERCISES/BizTime/node_modules/pg-protocol/dist/parser.js:40:17)
    at TLSSocket.<anonymous> (/home/solnguyen93/Springboard/EXERCISES/BizTime/node_modules/pg-protocol/dist/index.js:11:42)
    at TLSSocket.emit (node:events:514:28)
    at addChunk (node:internal/streams/readable:545:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:495:3)
    at Readable.push (node:internal/streams/readable:375:5)