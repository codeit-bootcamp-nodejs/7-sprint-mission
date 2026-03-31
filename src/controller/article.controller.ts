import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { CreateArticleDto, UpdateArticleDto } from '../types/article.type';
import { ArticleService } from '../service/article.service';
import type { CommentDto } from '../types/comment.type';

// articleId params interface
interface ArticleParams extends ParamsDictionary {
  articleId: string;
}

export class ArticleController {
  private articleService = new ArticleService();
  /**
   * 게시글 목록 조회 컨트롤러
   * @param {Request} req - 요청 객체 (query: page, limit, keyword)
   * @param {Response} res - 응답 객체 (articles: 게시글 목록, meta 데이터 변환)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description
   * 1. 페이지네이션과 키워드 검색을 지원
   * 2. 로그인 시 본인이 좋아요한 게시글 여부를 판단합니다.
   */
  articleGet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(Number(req.query.page ?? 1), 1);
      const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);
      const userId = req.user ? BigInt(req.user.userId) : null;
      const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;

      const { articles, totalCount } = await this.articleService.getArticles(
        page,
        limit,
        keyword,
        userId,
      );

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

  /**
   * 게시글 상세 조회 컨트롤러
   * @param {Request} req - 요청 객체 (params: articleId, user: 로그인정보)
   * @param {Response} res - 응답 객체 (article: 게시글 상세 정보)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description
   * 1. URL 파라미터의 articleId를 BigInt로 변환하여 조회합니다.
   * 2. 로그인 한 유저는 본인이 좋아요 누른 게시글인지 여부를 함께 반환합니다.
   */
  articleFindGet = async (req: Request<ArticleParams>, res: Response, next: NextFunction) => {
    try {
      const articleId = BigInt(req.params.articleId);
      const userId = req.user ? BigInt(req.user.userId) : null;

      const article = await this.articleService.getArticleDetail(articleId, userId);

      res.status(200).json({ message: '게시글 조회를 성공하였습니다.', data: { article } });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 게시글 작성 컨트롤러
   * @param {Request} req - 요청 객체 (body: CreateArticleDto, user: 로그인 정보)
   * @param {Response} res - 응답 객체 (message: 성공 메세지, data: 작성된 게시글 정보)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 게시글을 작성할 수 있도록 하며, 작성된 게시글 정보를 반환합니다.
   */
  articleCreate = async (
    req: Request<{}, {}, CreateArticleDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = BigInt(req.user!.userId);
      const nickname = req.user!.nickname;
      const article = await this.articleService.createArticle(req.body, userId);

      res
        .status(201)
        .json({ message: `${nickname}님, 게시글이 성공적으로 등록되었습니다.`, data: article });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 게시글 수정 컨트롤러
   * @param {Request} req - 요청 객체 (params: articleId, body: UpdateArticleDto, user: 로그인 정보)
   * @param {Response} res - 응답 객체 (message: 성공 메세지, data: 수정된 게시글 정보)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 본인의 게시글만 수정할 수 있도록 하며, 수정된 게시글 정보를 반환합니다.
   */
  articleUpdate = async (
    req: Request<ArticleParams, {}, UpdateArticleDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const articleId = BigInt(req.params.articleId);
      const userId = BigInt(req.user!.userId);
      const nickname = req.user!.nickname;

      const article = await this.articleService.updateArticle(articleId, userId, req.body);

      res
        .status(200)
        .json({ message: `${nickname}님, 게시글이 성공적으로 수정되었습니다.`, data: article });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 게시글 삭제 컨트롤러
   * @param {Request} req - 요청 객체 (params: articleId, user: 로그인 정보)
   * @param {Response} res - 응답 객체 (message: 성공 메세지)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 본인의 게시글만 삭제할 수 있도록 하며, 성공 시 204 No Content 상태 코드를 반환합니다.
   */
  articleDelete = async (req: Request<ArticleParams>, res: Response, next: NextFunction) => {
    try {
      const articleId = BigInt(req.params.articleId);
      const userId = BigInt(req.user!.userId);

      await this.articleService.deleteArticle(articleId, userId);

      res.status(204).end();
    } catch (e) {
      next(e);
    }
  };

  /**
   * 게시글 댓글 작성 컨트롤러
   * @param {Request} req - 요청 객체 (params: articleId, body: CommentDto, user: 로그인 정보)
   * @param {Response} res - 응답 객체 (message: 성공 메세지, data: 작성된 댓글 정보)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 게시글에 댓글을 작성할 수 있도록 하며, 작성된 댓글 정보를 반환합니다.
   */
  createArticleComment = async (
    req: Request<ArticleParams, {}, CommentDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = BigInt(req.user!.userId);
      const nickname = req.user!.nickname;
      const articleId = BigInt(req.params.articleId);

      const comment = await this.articleService.createArticleComment(articleId, userId, req.body);

      res.status(201).json({
        message: `${nickname}님의 댓글이 등록되었습니다.`,
        data: comment,
      });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 게시글 댓글 목록 조회 컨트롤러
   * @param {Request} req - 요청 객체 (params: articleId, query: cursor, limit)
   * @param {Response} res - 응답 객체 (data: 댓글 목록, nextCursor: 다음 커서)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 게시글의 댓글 목록을 조회할 수 있도록 하며, 페이지네이션을 지원합니다.
   */
  getArticleComments = async (req: Request<ArticleParams>, res: Response, next: NextFunction) => {
    try {
      const articleId = BigInt(req.params.articleId);

      const cursorRaw = req.query.cursor;
      const cursor = typeof cursorRaw === 'string' ? BigInt(cursorRaw) : undefined;
      const limit = Number(req.query.limit ?? 10);

      const { comments, nextCursor } = await this.articleService.getArticleComments(
        articleId,
        cursor,
        limit,
      );

      res.status(200).json({
        data: comments,
        nextCursor,
      });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 게시글 이미지 업로드 컨트롤러
   * @param {Request} req - 요청 객체 (file: 업로드된 이미지 파일)
   * @param {Response} res - 응답 객체 (imageUrl: 저장된 이미지 경로)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description Multer를 통해 업로드된 파일의 경로를 생성하여 클라이언트에 반환합니다.
   */
  uploadArticleImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file as Express.MulterS3.File;
      if (!file) {
        throw new ValidationError('이미지 파일이 필요합니다.');
      }

      const imagePath = file.location;

      res.status(201).json({
        message: '이미지 업로드 성공',
        imageUrl: imagePath,
      });
    } catch (e) {
      next(e);
    }
  };
}
