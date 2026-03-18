import express from 'express';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport/index';
import { readNotification } from '../controllers/notificationsController';

const notificationsRouter = express.Router();

notificationsRouter.patch(
    '/:id/read',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(readNotification),
);

export default notificationsRouter;
