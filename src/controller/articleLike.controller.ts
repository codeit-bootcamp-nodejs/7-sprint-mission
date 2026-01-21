import { UnauthenticatedError } from '../errors/unauthenticatedError';
import type { Request, Response, NextFunction } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { likeArticleService, unLikeArticleService } from '../service/articleLike.service';

interface ArticleParams extends ParamsDictionary {
  articleId: string;
}

// 게시글 좋아요 컨트롤러
export const likeArticle = async (
  req: Request<ArticleParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthenticatedError('로그인이 필요합니다.');
    }
    const userId = BigInt(req.user.userId);
    const nickname = req.user.nickname;
    const articleId = BigInt(req.params.articleId);

    await likeArticleService(userId, articleId);

    res.status(201).json({ message: `${nickname}님, 해당 게시글을 좋아요 하였습니다.` });
  } catch (e) {
    next(e);
  }
};
// 게시글 좋아요 취소 컨트롤러
export const unLikeArticle = async (
  req: Request<ArticleParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthenticatedError('로그인이 필요합니다.');
    }
    const userId = BigInt(req.user.userId);
    const articleId = BigInt(req.params.articleId);

    await unLikeArticleService(userId, articleId);

    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
