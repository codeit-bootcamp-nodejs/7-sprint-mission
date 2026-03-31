import { NotFoundError } from '../errors/notFoundError';
import { ProductRepo } from '../repository/product.repository';
import {
  deleteProductLikeRepo,
  isProductLikedByUser,
  productLikeRepo,
} from '../repository/productLike.repository';

const productRepo = new ProductRepo();

// 상품 좋아요 서비스
export const productLikeService = async (userId: bigint, productId: bigint) => {
  const product = await productRepo.findDetailProduct(productId);
  if (!product) throw new NotFoundError('상품을 찾을 수 없습니다.');

  const existingLike = await isProductLikedByUser(userId, productId);
  if (existingLike) {
    await deleteProductLikeRepo(userId, productId);
    return { isLiked: false, message: '관심 상품에서 제거되었습니다.' };
  } else {
    await productLikeRepo(userId, productId);
    return { isLiked: true, message: '관심 상품에 추가되었습니다.' };
  }
};
