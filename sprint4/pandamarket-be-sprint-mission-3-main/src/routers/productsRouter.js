import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  toggleProductLike,
  getLikedProducts,
} from '../controllers/productsController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { optional } from 'superstruct';

const productsRouter = express.Router();

productsRouter.post('/', authenticate(), withAsync(createProduct));
productsRouter.get('/:id', authenticate({ optional: true }), withAsync(getProduct));
productsRouter.patch('/:id', authenticate(), withAsync(updateProduct));
productsRouter.delete('/:id', authenticate(), withAsync(deleteProduct));
productsRouter.get('/', withAsync(getProductList));
productsRouter.post('/:id/comments', authenticate(), withAsync(createComment));
productsRouter.get('/:id/comments', withAsync(getCommentList));
productsRouter.post('/:id/like', authenticate(), withAsync(toggleProductLike));
// '내가 좋아요 한 상품 목록'은 유저 정보 경로로 가거나 상품 경로로
productsRouter.get('/liked', authenticate(), withAsync(getLikedProducts));

export default productsRouter;
