import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
    createProduct,
    deleteProduct,
    getMyLikedProducts,
    getProduct,
    getProductList,
    toggleProductLike,
    updateProduct,
} from '../controllers/productController';
import {
    createComment,
    deleteComment,
    getCommentList,
    updateComment,
} from '../controllers/commentController';
import passport from '../lib/passport/index';

const productRouter = express.Router();

//좋아요한 상품 목록
productRouter.get(
    '/like/list',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(getMyLikedProducts),
);
productRouter.patch(
    '/:targetId/comments/:id',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(updateComment),
);
productRouter.delete(
    '/:targetId/comments/:id',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(deleteComment),
);
//답글 작성
productRouter.post(
    '/:id/comments',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(createComment),
);
//답글 조회
productRouter.get('/:id/comments', withAsync(getCommentList));
//상품추가
productRouter.post(
    '/',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(createProduct),
);
//상품조회
productRouter.get('/:id', withAsync(getProduct));
productRouter.patch(
    '/:id',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(updateProduct),
);
productRouter.delete(
    '/:id',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(deleteProduct),
);
//상품 좋아
productRouter.post(
    '/:id/like',
    passport.authenticate('access-token', { session: false, failWithError: true }),
    withAsync(toggleProductLike),
);
//상품목록
productRouter.get('/', withAsync(getProductList));
export default productRouter;
