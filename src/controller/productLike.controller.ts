import { productLikeService } from '../service/productLike.service';
import type { Request, Response, NextFunction } from 'express';
import type { ProductParams } from '../types/product.type';

//상품 좋아요 컨트롤러
export const likeProduct = async (
  req: Request<ProductParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = BigInt(req.user!.userId);
    const nickname = req.user!.nickname;
    const productId = BigInt(req.params.productId);

    const { isLiked, message } = await productLikeService(userId, productId);

    res.status(200).json({
      message: `${nickname}님, ${message}.`,
      data: isLiked,
    });
  } catch (e) {
    next(e);
  }
};
