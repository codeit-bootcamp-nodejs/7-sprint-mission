import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { authenticate } from '../lib/authenticate.js';
import {
  getUser,
  updateUser,
  updatePassword,
  getMyProducts,
  getLikedProducts
} from '../controllers/userController.js';

const usersRouter = express.Router();

usersRouter.get('/me', authenticate(), withAsync(getUser));
usersRouter.patch('/me', authenticate(), withAsync(updateUser));
usersRouter.patch('/me/password', authenticate(), withAsync(updatePassword));
usersRouter.get('/me/products', authenticate(), withAsync(getMyProducts));
usersRouter.get('/me/liked-products', authenticate(), withAsync(getLikedProducts));

export default usersRouter;