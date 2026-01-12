import express from 'express';
import { authMiddleware } from '../lib/authMiddleware.js';
import { withAsync } from '../lib/withAsync.js';
import { toggleProductLike, getMyLikedProducts } from '../controllers/likesController.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/products/:productId', withAsync(toggleProductLike));
router.get('/my/products', withAsync(getMyLikedProducts));

export default router;