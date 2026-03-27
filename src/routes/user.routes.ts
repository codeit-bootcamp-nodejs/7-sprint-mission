import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateUpdateUser, validateChangePassword } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getMe);
router.patch('/me', validate(validateUpdateUser), userController.updateMe);
router.patch('/me/password', validate(validateChangePassword), userController.changePassword);
router.get('/me/products', userController.getMyProducts);
router.get('/me/liked-products', userController.getMyLikedProducts);

export default router;
