import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { withAsync } from '../lib/withAsync.js';

const authRouter = express.Router();

authRouter.post('/register', withAsync(authController.register));
authRouter.post('/login', withAsync(authController.login));
authRouter.post('/logout', withAsync(authController.logout));
authRouter.post('/refresh', withAsync(authController.refresh));

// 인증이 필요한 경로들
authRouter.get('/me', authenticate(), withAsync(authController.getMe));
authRouter.patch('/me', authenticate(), withAsync(authController.updateMe));
authRouter.patch('/me/password', authenticate(), withAsync(authController.updatePassword));
authRouter.get('/me/products', authenticate(), withAsync(authController.getMyProducts));

export default authRouter;
