import * as commentRepo from '../repositories/comment.repository';
import { ApiError } from '../utils/ApiError';
import { toCommentDto } from '../dtos/comment.dto';
import { buildCursorResult } from '../utils/pagination';

export async function createProductComment(data: { content: string; productId: number; authorId: number }) {
  const comment = await commentRepo.createProductComment(data);
  return toCommentDto(comment);
}

export async function createArticleComment(data: { content: string; articleId: number; authorId: number }) {
  const comment = await commentRepo.createArticleComment(data);
  return toCommentDto(comment);
}

export async function getProductComments(productId: number, cursor: number | undefined, limit: number) {
  const raw = await commentRepo.findProductComments(productId, cursor, limit);
  const result = buildCursorResult(raw, limit);
  return { data: result.data.map(toCommentDto), nextCursor: result.nextCursor };
}

export async function getArticleComments(articleId: number, cursor: number | undefined, limit: number) {
  const raw = await commentRepo.findArticleComments(articleId, cursor, limit);
  const result = buildCursorResult(raw, limit);
  return { data: result.data.map(toCommentDto), nextCursor: result.nextCursor };
}

export async function updateComment(
  type: 'product' | 'article',
  id: number,
  content: string,
  userId: number
) {
  if (type === 'product') {
    const comment = await commentRepo.findProductCommentById(id);
    if (!comment) throw new ApiError(404, 'Comment not found');
    if (comment.authorId !== userId) throw new ApiError(403, 'Forbidden');
    const updated = await commentRepo.updateProductComment(id, content);
    return toCommentDto(updated);
  } else {
    const comment = await commentRepo.findArticleCommentById(id);
    if (!comment) throw new ApiError(404, 'Comment not found');
    if (comment.authorId !== userId) throw new ApiError(403, 'Forbidden');
    const updated = await commentRepo.updateArticleComment(id, content);
    return toCommentDto(updated);
  }
}

export async function deleteComment(
  type: 'product' | 'article',
  id: number,
  userId: number
) {
  if (type === 'product') {
    const comment = await commentRepo.findProductCommentById(id);
    if (!comment) throw new ApiError(404, 'Comment not found');
    if (comment.authorId !== userId) throw new ApiError(403, 'Forbidden');
    await commentRepo.deleteProductComment(id);
  } else {
    const comment = await commentRepo.findArticleCommentById(id);
    if (!comment) throw new ApiError(404, 'Comment not found');
    if (comment.authorId !== userId) throw new ApiError(403, 'Forbidden');
    await commentRepo.deleteArticleComment(id);
  }
}
