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
  .get(authMiddleware, withAsync(getUserMe))
  .patch(authMiddleware, withAsync(updateUserMe));

usersRouter.post('/me/password', authMiddleware, withAsync(changePassword));

usersRouter.get('/me/products', authMiddleware, withAsync(getMyProducts));

usersRouter.get('/me/favorites', authMiddleware, withAsync(getMyFavoriteProducts));
export default usersRouter;
