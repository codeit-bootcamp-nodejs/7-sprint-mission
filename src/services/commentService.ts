import { commentRepository } from '../repositories/commentRepository';
import { articleRepository } from '../repositories/articleRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { CreateCommentBody, UpdateCommentBody } from '../structs/commentsStruct';

export const commentService = {
  async createComment(userId: number, articleId: number, data: CreateCommentBody) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    return commentRepository.create(userId, { articleId }, data);
  },

  async getComments(articleId: number, cursor?: number, limit: number = 10) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    const commentsWithCursor = await commentRepository.findListByTarget({ articleId }, cursor, limit);
    
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