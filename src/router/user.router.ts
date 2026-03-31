import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware';
import { UserController } from '../controller/user.controller';
import { myProfileUpload } from '../middlewares/upload';
import { validateUpdateProfile, validateChangePassword } from '../middlewares/user.validationError';

const userRouter = express.Router();

userRouter.use(authenticateUser);
const userController = new UserController();

userRouter.get('/me', userController.getProfile);
userRouter.patch(
  '/me',
  myProfileUpload.single('image'),
  validateUpdateProfile,
  userController.updateProfile,
);
userRouter.patch('/me/password', validateChangePassword, userController.changePassword);
userRouter.get('/me/product', userController.getUserProducts);
userRouter.get('/me/likes/products', userController.getLikedProducts);
userRouter.get('/me/likes/articles', userController.getLikedArticles);

export default userRouter;
