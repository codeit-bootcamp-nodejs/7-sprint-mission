import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { register, login, logout } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', withAsync(register));
authRouter.post('/login', withAsync(login));
authRouter.post('/logout', withAsync(logout));

export default authRouter;