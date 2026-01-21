import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware';
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getMyProduct,
  getMyLikedProducts,
  getMyLikedArticles,
} from '../controller/user.controller';
import { myProfileUpload } from '../middlewares/upload';
import { validateUpdateProfile, validateChangePassword } from '../middlewares/user.validationError';

const userRouter = express.Router();

userRouter.get('/me', authenticateUser, getMyProfile);
userRouter.patch(
  '/me',
  authenticateUser,
  myProfileUpload.single('image'),
  validateUpdateProfile,
  updateMyProfile,
);
userRouter.patch('/me/password', authenticateUser, validateChangePassword, changeMyPassword);
userRouter.get('/me/product', authenticateUser, getMyProduct);
userRouter.get('/me/likes/products', authenticateUser, getMyLikedProducts);
userRouter.get('/me/likes/articles', authenticateUser, getMyLikedArticles);

export default userRouter;
