import express from 'express';
import User from '../models/user.js';
import ExpressError from '../expressError.js';
import { SECRET_KEY } from '../config.js';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const authRoutes = express.Router();
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
authRoutes.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ExpressError('Username and password required', 400);
        }
        if (await User.authenticate(username, password)) {
            const token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);

            // Set the token as an HttpOnly cookie
            res.cookie('jwtToken', token, { httpOnly: true });

            // Send the token in the JSON response
            res.status(200).json({ token });
        } else {
            throw new ExpressError('Invalid username or password', 400);
        }
    } catch (e) {
        next(e);
    }
});
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
authRoutes.post('/register', async (req, res, next) => {
    try {
        if (req.user) {
            throw new ExpressError('You are already logged in.', 400);
        }
        const { username, password, first_name, last_name, phone } = req.body;
        if (!username || !password || !first_name || !last_name || !phone) {
            throw new ExpressError('Missing required field(s)');
        }
        const registeredUser = await User.register({ username, password, first_name, last_name, phone });
        if (registeredUser) {
            const token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);

            // Set the token as an HttpOnly cookie
            res.cookie('jwtToken', token, { httpOnly: true });

            // Send the token in the JSON response
            res.status(201).json({ token });
        } else {
            throw new ExpressError('Registration failed.');
        }
    } catch (e) {
        next(e);
    }
});

export default authRoutes;
