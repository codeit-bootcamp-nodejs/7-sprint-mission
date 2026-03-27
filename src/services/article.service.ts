import * as articleRepo from '../repositories/article.repository';
import * as likeRepo from '../repositories/like.repository';
import { ApiError } from '../utils/ApiError';
import { toArticleDto } from '../dtos/article.dto';
import { getOffsetPaginationParams, buildOffsetResult } from '../utils/pagination';

export async function getArticles(params: {
  page: number;
  pageSize: number;
  keyword?: string;
  userId?: number;
}) {
  const { skip, take } = getOffsetPaginationParams({ page: params.page, pageSize: params.pageSize });
  const { data, total } = await articleRepo.findArticles({ skip, take, keyword: params.keyword });

  const likedSet = params.userId
    ? await likeRepo.findArticleLikesByUser(params.userId, data.map((a) => a.id))
    : new Set<number>();

  const dtos = data.map((a) => toArticleDto(a, likedSet.has(a.id)));
  return buildOffsetResult(dtos, total, { page: params.page, pageSize: params.pageSize });
}

export async function getArticle(id: number, userId?: number) {
  const article = await articleRepo.findArticleById(id);
  if (!article) throw new ApiError(404, 'Article not found');
  const isLiked = userId ? !!(await likeRepo.findArticleLike(userId, id)) : false;
  return toArticleDto(article, isLiked);
}

export async function createArticle(data: { title: string; content: string }, authorId: number) {
  const article = await articleRepo.createArticle({
    title: data.title,
    content: data.content,
    author: { connect: { id: authorId } },
  });
  return toArticleDto(article, false);
}

export async function updateArticle(
  id: number,
  data: { title?: string; content?: string },
  userId: number
) {
  const article = await articleRepo.findArticleById(id);
  if (!article) throw new ApiError(404, 'Article not found');
  if (article.authorId !== userId) throw new ApiError(403, 'Forbidden');
  const [updated, isLiked] = await Promise.all([
    articleRepo.updateArticle(id, data),
    likeRepo.findArticleLike(userId, id),
  ]);
  return toArticleDto(updated, !!isLiked);
}

export async function deleteArticle(id: number, userId: number) {
  const article = await articleRepo.findArticleById(id);
  if (!article) throw new ApiError(404, 'Article not found');
  if (article.authorId !== userId) throw new ApiError(403, 'Forbidden');
  await articleRepo.deleteArticle(id);
}

export async function likeArticle(articleId: number, userId: number) {
  const article = await articleRepo.findArticleById(articleId);
  if (!article) throw new ApiError(404, 'Article not found');
  const existing = await likeRepo.findArticleLike(userId, articleId);
  if (existing) throw new ApiError(409, 'Already liked');
  await likeRepo.createArticleLike(userId, articleId);
  const updated = await articleRepo.findArticleById(articleId);
  return toArticleDto(updated!, true);
}

export async function unlikeArticle(articleId: number, userId: number) {
  const article = await articleRepo.findArticleById(articleId);
  if (!article) throw new ApiError(404, 'Article not found');
  const existing = await likeRepo.findArticleLike(userId, articleId);
  if (!existing) throw new ApiError(404, 'Like not found');
  await likeRepo.deleteArticleLike(userId, articleId);
  const updated = await articleRepo.findArticleById(articleId);
  return toArticleDto(updated!, false);
}
