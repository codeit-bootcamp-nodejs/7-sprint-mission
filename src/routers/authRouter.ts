import express from 'express';
import * as authController from '../controllers/authController';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport/index';
const authsRouter = express.Router();
authsRouter.post(
    '/login',
    passport.authenticate('local', { session: false, failWithError: true }),
    withAsync(authController.login),
);
authsRouter.post('/logout', withAsync(authController.logout));
authsRouter.get(
    '/me',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(authController.me),
);
authsRouter.patch(
    '/me',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(authController.updateMe),
);
authsRouter.post('/register', withAsync(authController.register));

authsRouter.patch(
    '/me/password',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(authController.changePassword),
);

authsRouter.post(
    '/refresh',
    passport.authenticate('refresh-token', { session: false, failWithError: true }),
    withAsync(authController.refreshTokens),
);
export default authsRouter;
