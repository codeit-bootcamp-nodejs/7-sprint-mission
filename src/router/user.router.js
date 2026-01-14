import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getMyProduct,
  getMyLikedProducts,
  getMyLikedArticles,
} from '../controller/user.controller.js';
import { myProfileUpload } from '../middlewares/upload.js';
import {
  validateUpdateProfile,
  validateChangePassword,
} from '../middlewares/user.validationError.js';

const userRouter = express.Router();

userRouter.get('/me', auth, getMyProfile);
userRouter.patch(
  '/me',
  auth,
  myProfileUpload.single('image'),
  validateUpdateProfile,
  updateMyProfile,
);
userRouter.patch('/me/password', auth, validateChangePassword, changeMyPassword);
userRouter.get('/me/product', auth, getMyProduct);
userRouter.get('/me/likes/products', auth, getMyLikedProducts);
userRouter.get('/me/likes/articles', auth, getMyLikedArticles);

export default userRouter;
