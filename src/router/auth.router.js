import express from 'express';
import { signup, login, refresh, logout } from '../controller/auth.controller.js';
import { validateSignup, validateLogin } from '../middlewares/auth.vaildationError.js';

const authRouter = express.Router();

authRouter.post('/signup', validateSignup, signup);
authRouter.post('/login', validateLogin, login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
export default authRouter;
