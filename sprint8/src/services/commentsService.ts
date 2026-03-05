import * as articlesRepository from '../repositories/articlesRepository';
import * as commentsRepository from '../repositories/commentsRepository';
import * as productsRepository from '../repositories/productsRepository';
import { CursorPaginationParams, CursorPaginationResult } from '../types/pagination';
import BadRequestError from '../lib/errors/BadRequestError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import Comment from '../types/Comment';

type CreateCommentData = Omit<
  Comment,
  'id' | 'productId' | 'articleId' | 'createdAt' | 'updatedAt'
> & {
  productId?: number;
  articleId?: number;
};

export async function createComment(data: CreateCommentData): Promise<Comment> {
  if (!data.articleId && !data.productId) {
    throw new BadRequestError('Either articleId or productId must be provided');
  }

  if (data.articleId) {
    const article = await articlesRepository.getArticle(data.articleId);
    if (!article) {
      throw new NotFoundError('해당 게시글이 존재하지 않습니다.');
    }
  }

  if (data.productId) {
    const product = await productsRepository.getProduct(data.productId);
    if (!product) {
      throw new NotFoundError('해당 상품이 존재하지 않습니다.');
    }
  }

  const comment = await commentsRepository.createComment({
    ...data,
    articleId: data.articleId ?? null,
    productId: data.productId ?? null,
  });
  return comment;
}

export async function getComment(id: number): Promise<Comment | null> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('해당 댓글이 존재하지 않습니다.');
  }
  return comment;
}

export async function getCommentListByArticleId(
  articleId: number,
  params: CursorPaginationParams,
): Promise<CursorPaginationResult<Comment>> {
  const article = await articlesRepository.getArticle(articleId);
  if (!article) {
    throw new NotFoundError('해당 게시글이 존재하지 않습니다.');
  }

  const result = commentsRepository.getCommentList({ articleId }, params);
  return result;
}

export async function getCommentListByProductId(
  productId: number,
  params: CursorPaginationParams,
): Promise<CursorPaginationResult<Comment>> {
  const product = await productsRepository.getProduct(productId);
  if (!product) {
    throw new NotFoundError('해당 상품이 존재하지 않습니다.');
  }

  const result = commentsRepository.getCommentList({ productId }, params);
  return result;
}

export async function updateComment(id: number, userId: number, content: string): Promise<Comment> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('해당 댓글이 존재하지 않습니다.');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  return commentsRepository.updateComment(id, { content });
}

export async function deleteComment(id: number, userId: number): Promise<void> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('해당 댓글이 존재하지 않습니다.');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  await commentsRepository.deleteComment(id);
}
