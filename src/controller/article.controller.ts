import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { CreateArticleDto, UpdateArticleDto } from '../types/article.type';
import {
  getArticleService,
  getArticleDetailService,
  createArticleService,
  updateArticleService,
  deleteArticleService,
  createArticleCommentService,
  getArticleCommentsService,
} from '../service/article.service';
import type { CommentDto } from '../types/comment.type';

// articleId 파라미터 인터페이스
interface ArticleParams extends ParamsDictionary {
  articleId: string;
}

// 게시글 목록 조회 컨트롤러
export const articleGet = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);
    const userId = req.user ? BigInt(req.user.userId) : null;
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;

    const { articles, totalCount } = await getArticleService(page, limit, keyword, userId);

    res.status(200).json({
      message: '게시글 목록 조회를 성공하였습니다.',
      data: articles,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (e) {
    next(e);
  }
};

// 게시글 상세 조회 컨트롤러
export const articleFindGet = async function (
  req: Request<ArticleParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const articleId = BigInt(req.params.articleId);
    const userId = req.user ? BigInt(req.user.userId) : null;

    const article = await getArticleDetailService(articleId, userId);

    res.status(200).json({ message: '게시글 조회를 성공하였습니다.', data: { article } });
  } catch (e) {
    next(e);
  }
};

// 게시글 작성 컨트롤러
export const articleCreate = async function (
  req: Request<{}, {}, CreateArticleDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = BigInt(req.user!.userId);
    const nickname = req.user!.nickname;
    const article = await createArticleService(req.body, userId);

    res
      .status(201)
      .json({ message: `${nickname}님, 게시글이 성공적으로 등록되었습니다.`, data: article });
  } catch (e) {
    next(e);
  }
};

// 게시글 수정 컨트롤러
export const articleUpdate = async function (
  req: Request<ArticleParams, {}, UpdateArticleDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const articleId = BigInt(req.params.articleId);
    const userId = BigInt(req.user!.userId);
    const nickname = req.user!.nickname;

    const article = await updateArticleService(articleId, userId, req.body);

    res
      .status(200)
      .json({ message: `${nickname}님, 게시글이 성공적으로 수정되었습니다.`, data: article });
  } catch (e) {
    next(e);
  }
};

// 게시글 삭제 컨트롤러
export const articleDelete = async function (
  req: Request<ArticleParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const articleId = BigInt(req.params.articleId);
    const userId = BigInt(req.user!.userId);

    await deleteArticleService(articleId, userId);

    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

// 게시글 댓글 작성 컨트롤러
export const createArticleComment = async (
  req: Request<ArticleParams, {}, CommentDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = BigInt(req.user!.userId);
    const nickname = req.user!.nickname;
    const articleId = BigInt(req.params.articleId);

    const comment = await createArticleCommentService(articleId, userId, req.body);

    res.status(201).json({
      message: `${nickname}님의 댓글이 등록되었습니다.`,
      data: comment,
    });
  } catch (e) {
    next(e);
  }
};

// 게시글 댓글 목록 조회 컨트롤러
export const getArticleComments = async (
  req: Request<ArticleParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const articleId = BigInt(req.params.articleId);

    const cursorRaw = req.query.cursor;
    const cursor = typeof cursorRaw === 'string' ? BigInt(cursorRaw) : undefined;
    const limit = Number(req.query.limit ?? 10);

    const { comments, nextCursor } = await getArticleCommentsService(articleId, cursor, limit);

    res.status(200).json({
      data: comments,
      nextCursor,
    });
  } catch (e) {
    next(e);
  }
};

export const uploadArticleImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new ValidationError('이미지 파일이 필요합니다.');
    }

    const imagePath = `/uploads/article/${file.filename}`;

    res.status(201).json({
      message: '이미지 업로드 성공',
      imageUrl: imagePath,
    });
  } catch (e) {
    next(e);
  }
};
