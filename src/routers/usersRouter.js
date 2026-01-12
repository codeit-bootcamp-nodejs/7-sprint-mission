import express from 'express';
import * as uc from '../controllers/usersController.js';
import { getMyLikedProducts } from '../controllers/likesController.js';
import { withAsync } from '../lib/withAsync.js';
import { authMiddleware } from '../lib/authMiddleware.js';

const router = express.Router();

router.post('/signup', withAsync(uc.signUp));
router.post('/signin', withAsync(uc.signIn));
router.post('/refresh', withAsync(uc.refresh));

router.use(authMiddleware);
router.get('/me', withAsync(uc.getMe));
router.patch('/me', withAsync(uc.updateMe));
router.patch('/me/password', withAsync(uc.changePassword));
router.get('/me/products', withAsync(uc.getMyProducts));
router.get('/me/liked-products', withAsync(getMyLikedProducts));

export default router;