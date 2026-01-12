import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import * as pc from '../controllers/productsController.js';
import { authMiddleware } from '../lib/authMiddleware.js';

const router = express.Router();

router.get('/', withAsync(pc.getProductList));
router.get('/:id', withAsync(pc.getProduct));

router.use(authMiddleware);
router.post('/', withAsync(pc.createProduct));
router.post('/:id/like', withAsync(pc.toggleProductLike));
router.post('/:id/comments', withAsync(pc.createComment));
router.get('/:id/comments', withAsync(pc.getCommentList));
router.patch('/:id', withAsync(pc.updateProduct));
router.delete('/:id', withAsync(pc.deleteProduct));

export default router;