import express from 'express';
import { AuthController } from '../controller/auth.controller';
import { validateSignup, validateLogin } from '../middlewares/auth.vaildationError';
import { authenticateUser } from '../middlewares/auth.middleware';

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/signup', validateSignup, authController.signup);
authRouter.post('/login', validateLogin, authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authenticateUser, authController.logout);
export default authRouter;
