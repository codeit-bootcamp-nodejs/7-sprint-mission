import * as commentRepository from '../repositories/commentRepository';
import * as articleRepository from '../repositories/articleRepository';
import * as productRepository from '../repositories/productRepository';
import { toCommentDto } from '../dto/commentDto';
import { sendNewCommentNotification } from './notificationService';

export async function getArticleComments(params: {
  articleId: number;
  cursor?: number;
  limit: number;
}) {
  const comments = await commentRepository.findCommentsByArticleId(params);
  const nextCursor =
    comments.length === params.limit ? comments[comments.length - 1].id : undefined;
  return { list: comments.map(toCommentDto), nextCursor };
}

export async function getProductComments(params: {
  productId: number;
  cursor?: number;
  limit: number;
}) {
  const comments = await commentRepository.findCommentsByProductId(params);
  const nextCursor =
    comments.length === params.limit ? comments[comments.length - 1].id : undefined;
  return { list: comments.map(toCommentDto), nextCursor };
}

export async function createArticleComment(data: {
  content: string;
  articleId: number;
  userId: number;
  commenterNickname: string;
}) {
  const article = await articleRepository.findArticleById(data.articleId);
  if (!article) {
    const error = new Error('게시글을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }

  const comment = await commentRepository.createArticleComment({
    content: data.content,
    articleId: data.articleId,
    userId: data.userId,
  });

  if (article.userId !== data.userId) {
    sendNewCommentNotification(
      {
        articleId: article.id,
        articleTitle: article.title,
        commentId: comment.id,
        commenterNickname: data.commenterNickname,
      },
      article.userId
    ).catch(console.error);
  }

  return toCommentDto(comment);
}

export async function createProductComment(data: {
  content: string;
  productId: number;
  userId: number;
}) {
  const product = await productRepository.findProductById(data.productId);
  if (!product) {
    const error = new Error('상품을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }

  const comment = await commentRepository.createProductComment({
    content: data.content,
    productId: data.productId,
    userId: data.userId,
  });

  return toCommentDto(comment);
}

export async function updateComment(id: number, userId: number, content: string) {
  const comment = await commentRepository.findCommentById(id);
  if (!comment) {
    const error = new Error('댓글을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  if (comment.userId !== userId) {
    const error = new Error('권한이 없습니다');
    (error as any).status = 403;
    throw error;
  }
  const updated = await commentRepository.updateComment(id, content);
  return toCommentDto(updated);
}

export async function deleteComment(id: number, userId: number) {
  const comment = await commentRepository.findCommentById(id);
  if (!comment) {
    const error = new Error('댓글을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  if (comment.userId !== userId) {
    const error = new Error('권한이 없습니다');
    (error as any).status = 403;
    throw error;
  }
  await commentRepository.deleteComment(id);
}
