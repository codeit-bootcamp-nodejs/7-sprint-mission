import express from 'express';
import { signup, login, refresh, logout } from '../controller/auth.controller';
import { validateSignup, validateLogin } from '../middlewares/auth.vaildationError';
import { authenticateUser } from '../middlewares/auth.middleware';

const authRouter = express.Router();

authRouter.post('/signup', validateSignup, signup);
authRouter.post('/login', validateLogin, login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', authenticateUser, logout);
export default authRouter;
