import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  createFavorite,
  deleteFavorite,
} from '../controllers/productsController';
import authenticate from '../middlewares/authenticate';

const productsRouter = express.Router();

productsRouter
  .route('/')
  .post(authenticate(), withAsync(createProduct))
  .get(authenticate({ optional: true }), withAsync(getProductList));

productsRouter
  .route('/:id')
  .get(authenticate({ optional: true }), withAsync(getProduct))
  .patch(authenticate(), withAsync(updateProduct))
  .delete(authenticate(), withAsync(deleteProduct));
  
productsRouter
  .route('/:id/comments')
  .post(authenticate(), withAsync(createComment))
  .get(withAsync(getCommentList));
  
productsRouter
  .route('/:id/favorites')
  .post(authenticate(), withAsync(createFavorite))
  .delete(authenticate(), withAsync(deleteFavorite));

export default productsRouter;
