import { ValidationError } from '../errors/validationError';
import { NotFoundError } from '../errors/notFoundError';
import { findArticle } from '../repository/article.repository';
import {
  articleLikeRepository,
  findArticleLike,
  unLikeArticleRepository,
} from '../repository/articleLike.repository';

// 게시글 좋아요 서비스
export const likeArticleService = async (userId: bigint, articleId: bigint): Promise<void> => {
  const article = await findArticle(articleId);
  if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다.');

  const existingLike = await findArticleLike(articleId, userId);
  if (existingLike) throw new ValidationError('이미 좋아요 한 상품입니다.');

  await articleLikeRepository(articleId, userId);
};

// 게시글 좋아요 취소 서비스
export const unLikeArticleService = async (userId: bigint, articleId: bigint): Promise<void> => {
  const article = await findArticle(articleId);
  if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다.');

  const existingLike = await findArticleLike(articleId, userId);
  if (!existingLike) throw new ValidationError('좋아요를 누르지 않은 게시글 입니다.');

  await unLikeArticleRepository(articleId, userId);
};
