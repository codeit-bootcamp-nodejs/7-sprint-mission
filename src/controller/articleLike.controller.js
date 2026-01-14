import prisma from '../../prisma/prisma.js';
import { ValidationError } from '../errors/validationError.js';
import { NotFoundError } from '../errors/notFoundError.js';

export const likeArticle = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);
    const articleId = BigInt(req.params.articleId);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }

    const alreadyLiked = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (alreadyLiked) {
      throw new ValidationError('이미 좋아요한 게시글입니다.');
    }

    await prisma.articleLike.create({
      data: {
        userId,
        articleId,
      },
    });

    res.status(201).json({ message: '해당 게시글을 좋아요 하였습니다.' });
  } catch (e) {
    next(e);
  }
};

export const unLikeArticle = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);
    const articleId = BigInt(req.params.articleId);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }

    const likedRecord = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (!likedRecord) {
      throw new ValidationError('해당 게시글을 좋아요 하지 않았습니다');
    }

    await prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
