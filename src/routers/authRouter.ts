import express from 'express';
import { withAsync } from '../lib/withAsync';
import { register, login, logout, refreshToken } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/register', withAsync(register));
authRouter.post('/login', withAsync(login));
authRouter.post('/logout', withAsync(logout));
authRouter.post('/refresh', withAsync(refreshToken));

export default authRouter;