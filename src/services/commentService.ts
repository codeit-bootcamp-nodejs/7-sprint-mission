import { commentRepository } from '../repositories/commentRepository';
import { articleRepository } from '../repositories/articleRepository';
import { productRepository } from '../repositories/productRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { CreateCommentBody, UpdateCommentBody } from '../structs/commentsStruct';
import { notificationService } from './notificationService';

type TargetType = 'article' | 'product';

export const commentService = {
  async createComment(userId: number, targetId: number, data: CreateCommentBody, targetType: TargetType) {
    let targetOwnerId: number | undefined;
    let articleTitle: string | undefined;

    if (targetType === 'article') {
    const article = await articleRepository.findById(targetId);
    if (!article) throw new NotFoundError('article', targetId);
    } else if (targetType === 'product') {
      const product = await productRepository.findById(targetId);
      if (!product) throw new NotFoundError('product', targetId);
    }
    const target = targetType === 'article' ? { articleId: targetId } : { productId: targetId };
    const comment = await commentRepository.create(userId, target, data);
    
    if (targetType === 'article' && targetOwnerId && targetOwnerId !== userId) {
      const content = `작성하신 게시글 "${articleTitle}"에 새로운 댓글이 달렸습니다.`;
      notificationService.createAndSend(targetOwnerId, content, 'NEW_COMMENT', targetId)
        .catch(err => console.error('댓글 알림 전송 실패:', err));
    }

    return comment;
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