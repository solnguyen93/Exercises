import express from 'express';
import User from '../models/user.js';
import ExpressError from '../expressError.js';
import { SECRET_KEY } from '../config.js';
import jwt from 'jsonwebtoken';
import { ensureLoggedIn, ensureCorrectUser } from '../middleware/auth.js';

const userRoutes = express.Router();
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
userRoutes.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const users = await User.all();
        res.json({ users });
    } catch (e) {
        next(e);
    }
});
/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
userRoutes.get('/:username', ensureCorrectUser, async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.get(username);
        res.json({ user });
    } catch (e) {
        next(e);
    }
});
/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
userRoutes.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
    try {
        const { username } = req.params;
        const messages = await User.messagesTo(username);
        res.json({ messages });
    } catch (e) {
        next(e);
    }
});
/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
userRoutes.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
    try {
        const { username } = req.params;
        const messages = await User.messagesFrom(username);
        res.json({ messages });
    } catch (e) {
        next(e);
    }
});

export default userRoutes;
