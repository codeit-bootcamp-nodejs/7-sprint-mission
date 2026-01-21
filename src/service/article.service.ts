import Article from '../model/article.model';
import Comment from '../model/comment.model';
import { NotFoundError } from '../errors/notFoundError';
import { ForbiddenError } from '../errors/forbiddenError';
import type { CreateArticleDto, UpdateArticleDto } from '../types/article.type';
import type { CommentDto } from '../types/comment.type';
import {
  createArticleCommnetRepository,
  createArticleRepository,
  deleteArticleRepository,
  findArticle,
  findArticles,
  findDetailArticle,
  getArticleCommentsRepository,
  updateArticleRepository,
} from '../repository/article.repository';

// 게시글 존재 여부, 유저 검증 로직
const validateOwner = async (articleId: bigint, userId: bigint): Promise<void> => {
  const article = await findArticle(articleId);
  if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다.');
  if (article.userId !== userId) throw new ForbiddenError('권한이 없습니다.');
};

// 게시글 목록 조회 서비스
export const getArticleService = async (
  page: number,
  limit: number,
  keyword: string | undefined,
  userId: bigint | null,
) => {
  const { entities, totalCount } = await findArticles(page, limit, keyword, userId);

  const articles = entities.map((entity) => ({
    ...Article.fromEntity(entity),
    isLiked: userId ? (entity.likes.length ?? 0) > 0 : false,
  }));

  return { articles, totalCount };
};

//게시글 상세 조회 서비스
export const getArticleDetailService = async (articleId: bigint, userId: bigint | null) => {
  const entity = await findDetailArticle(articleId, userId);

  if (!entity) {
    throw new NotFoundError('해당 게시물을 찾을 수 없습니다.');
  }

  const isLiked = userId ? entity.likes.length > 0 : false;

  const article = Article.fromEntity(entity);
  return {
    article: { ...article, isLiked },
  };
};

// 게시글 생성 서비스
export const createArticleService = async (dto: CreateArticleDto, userId: bigint) => {
  const entity = await createArticleRepository(userId, dto);

  return Article.fromEntity(entity);
};

// 게시글 수정 서비스
export const updateArticleService = async (
  articleId: bigint,
  userId: bigint,
  dto: UpdateArticleDto,
) => {
  await validateOwner(articleId, userId);

  const entity = await updateArticleRepository(articleId, dto);

  const updateArticle = Article.fromEntity(entity);

  return updateArticle;
};

// 게시글 삭제 서비스
export const deleteArticleService = async (articleId: bigint, userId: bigint): Promise<void> => {
  await validateOwner(articleId, userId);

  await deleteArticleRepository(articleId);
};

// 게시글 댓글 작성 서비스
export const createArticleCommentService = async (
  articleId: bigint,
  userId: bigint,
  dto: CommentDto,
) => {
  const article = await findArticle(articleId);
  if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다.');

  const comment = await createArticleCommnetRepository(articleId, userId, dto);

  return Comment.fromEntity(comment);
};

// 게시글 댓글 목록 조회 서비스
export const getArticleCommentsService = async (
  articleId: bigint,
  cursor: bigint | undefined,
  limit: number,
) => {
  const article = await findArticle(articleId);
  if (!article) throw new NotFoundError('해당 게시물을 찾을 수 없습니다.');

  const entities = await getArticleCommentsRepository(articleId, limit, cursor);

  const hasNextPage = entities.length > limit;

  // 실제로 반환할 데이터 슬라이싱
  const commentsToReturn = hasNextPage ? entities.slice(0, limit) : entities;

  const nextCursor = hasNextPage
    ? commentsToReturn[commentsToReturn.length - 1]?.id.toString()
    : null;

  const comments = commentsToReturn.map((entity) => Comment.fromEntity(entity));

  return { comments, nextCursor };
};
