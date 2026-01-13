import { commentRepository } from '../repositories/commentRepository';
import { articleRepository } from '../repositories/articleRepository';
import { productRepository } from '../repositories/productRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { CreateCommentBody, UpdateCommentBody } from '../structs/commentsStruct';

type TargetType = 'article' | 'product';

export const commentService = {
  async createComment(userId: number, targetId: number, data: CreateCommentBody, targetType: TargetType) {
    if (targetType === 'article') {
    const article = await articleRepository.findById(targetId);
    if (!article) throw new NotFoundError('article', targetId);
    } else if (targetType === 'product') {
      const product = await productRepository.findById(targetId);
      if (!product) throw new NotFoundError('product', targetId);
    }
    const target = targetType === 'article' ? { articleId: targetId } : { productId: targetId };

    return commentRepository.create(userId, target, data);
  },

  async getComments(targetId: number, targetType: TargetType, cursor?: number, limit: number = 10) {
    if (targetType === 'article') {
      const article = await articleRepository.findById(targetId);
      if (!article) throw new NotFoundError('article', targetId);
    } else if (targetType === 'product') {
      const product = await productRepository.findById(targetId);
      if (!product) throw new NotFoundError('product', targetId);
    }
    const target = targetType === 'article' ? { articleId: targetId } : { productId: targetId };

    const commentsWithCursor = await commentRepository.findListByTarget(target , cursor, limit);
    
    const comments = commentsWithCursor.slice(0, limit);
    const lastItem = commentsWithCursor[commentsWithCursor.length - 1];
    const nextCursor = commentsWithCursor.length > limit ? lastItem?.id : null;

    return { list: comments, nextCursor };
  },

  async updateComment(userId: number, commentId: number, data: UpdateCommentBody) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new NotFoundError('comment', commentId);

    if (comment.userId !== userId) {
      throw new ForbiddenError('You are not allowed to update this comment');
    }

    return commentRepository.update(commentId, data);
  },

  async deleteComment(userId: number, commentId: number) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new NotFoundError('comment', commentId);

    if (comment.userId !== userId) {
      throw new ForbiddenError('You are not allowed to delete this comment');
    }

    return commentRepository.delete(commentId);
  },
};