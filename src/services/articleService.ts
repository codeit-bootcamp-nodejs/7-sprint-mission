import * as articleRepository from '../repositories/articleRepository';
import { toArticleDto } from '../dto/articleDto';

export async function getArticles(params: {
  orderBy?: string;
  page?: number;
  pageSize?: number;
  keyword?: string;
}) {
  const orderBy = (params.orderBy === 'like' ? 'like' : 'recent') as 'recent' | 'like';
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  const { articles, totalCount } = await articleRepository.findArticles({
    orderBy,
    page,
    pageSize,
    keyword: params.keyword,
  });

  return { list: articles.map(toArticleDto), totalCount };
}

export async function getArticle(id: number) {
  const article = await articleRepository.findArticleById(id);
  if (!article) {
    const error = new Error('게시글을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  return toArticleDto(article);
}

export async function createArticle(data: {
  title: string;
  content: string;
  image?: string;
  userId: number;
}) {
  const article = await articleRepository.createArticle(data);
  return toArticleDto(article);
}

export async function updateArticle(
  id: number,
  userId: number,
  data: { title?: string; content?: string; image?: string }
) {
  const article = await articleRepository.findArticleById(id);
  if (!article) {
    const error = new Error('게시글을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  if (article.userId !== userId) {
    const error = new Error('권한이 없습니다');
    (error as any).status = 403;
    throw error;
  }
  const updated = await articleRepository.updateArticle(id, data);
  return toArticleDto(updated);
}

export async function deleteArticle(id: number, userId: number) {
  const article = await articleRepository.findArticleById(id);
  if (!article) {
    const error = new Error('게시글을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  if (article.userId !== userId) {
    const error = new Error('권한이 없습니다');
    (error as any).status = 403;
    throw error;
  }
  await articleRepository.deleteArticle(id);
}

export async function likeArticle(articleId: number, userId: number) {
  const article = await articleRepository.findArticleById(articleId);
  if (!article) {
    const error = new Error('게시글을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  const existing = await articleRepository.findLike(articleId, userId);
  if (existing) {
    const error = new Error('이미 좋아요한 게시글입니다');
    (error as any).status = 409;
    throw error;
  }
  await articleRepository.createLike(articleId, userId);
  const updated = await articleRepository.findArticleById(articleId);
  return toArticleDto(updated!);
}

export async function unlikeArticle(articleId: number, userId: number) {
  const article = await articleRepository.findArticleById(articleId);
  if (!article) {
    const error = new Error('게시글을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  await articleRepository.deleteLike(articleId, userId);
  const updated = await articleRepository.findArticleById(articleId);
  return toArticleDto(updated!);
}
