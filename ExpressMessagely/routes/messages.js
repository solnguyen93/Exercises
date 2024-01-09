import express from 'express';
import Message from '../models/message.js';
import ExpressError from '../expressError.js';
import { SECRET_KEY } from '../config.js';
import jwt from 'jsonwebtoken';
import { ensureLoggedIn, ensureCorrectUser } from '../middleware/auth.js';

const messageRoutes = express.Router();
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
messageRoutes.get('/:id', ensureCorrectUser, async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await Message.get(id);
        res.json({ message });
    } catch (e) {
        next(e);
    }
});
/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
messageRoutes.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const { to_username, body } = req.body;
        const message = await Message.create(req.user.user.username, to_username, body);
        res.json({ message });
    } catch (e) {
        next(e);
    }
});
/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
messageRoutes.post('/:id/read', ensureCorrectUser, async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await Message.get(id);
        if (message.to_username === req.user.user.username) {
            const readMessage = await Message.markRead(id);
            res.json({ readMessage });
        } else {
            throw new ExpressError('Unauthorized', 401);
        }
    } catch (e) {
        next(e);
    }
});
export default messageRoutes;
