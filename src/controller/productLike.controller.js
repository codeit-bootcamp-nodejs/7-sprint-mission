import prisma from '../../prisma/prisma.js';
import { NotFoundError } from '../errors/notFoundError.js';
import { ValidationError } from '../errors/validationError.js';

export const likeProduct = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);
    const productId = BigInt(req.params.productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const alreadyLiked = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (alreadyLiked) {
      throw new ValidationError('이미 좋아요한 상품입니다.');
    }

    await prisma.productLike.create({
      data: {
        userId,
        productId,
      },
    });

    res.status(201).json({ message: '해당 상품을 좋아요 하였습니다.' });
  } catch (e) {
    next(e);
  }
};

export const unLikeProduct = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);
    const productId = BigInt(req.params.productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const likedRecord = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!likedRecord) {
      throw new ValidationError('해당 상품을 좋아요 하지 않았습니다');
    }

    await prisma.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
