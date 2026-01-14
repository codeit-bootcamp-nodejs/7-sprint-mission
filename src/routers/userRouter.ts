import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  changePassword,
  getMyFavoriteProducts,
  getMyProducts,
  getUserMe,
  updateUserMe,
} from '../controllers/usersController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const usersRouter = express.Router();

usersRouter
  .route('/me')
  .get(authMiddleware, authMiddleware, withAsync(getUserMe))
  .patch(authMiddleware, authMiddleware, withAsync(updateUserMe));

usersRouter
  .route('/me/password')
  .post(authMiddleware, authMiddleware, withAsync(changePassword))
  .get(authMiddleware, authMiddleware, withAsync(getMyProducts));

usersRouter.get('/me/favorites', authMiddleware, withAsync(getMyFavoriteProducts));
export default usersRouter;
