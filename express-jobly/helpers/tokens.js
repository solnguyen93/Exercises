// 'use strict'; // Not needed in ESModule

import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

/**
 * Returns a signed JWT from user data.
 *
 * @param {object} user - The user object containing user data.
 * @returns {string} The JWT token.
 */
function createToken(user) {
    console.assert(user.isAdmin !== undefined, 'createToken passed user without isAdmin property');

    let payload = {
        username: user.username,
        isAdmin: user.isAdmin || false,
    };

    return jwt.sign(payload, SECRET_KEY);
}

export { createToken };
