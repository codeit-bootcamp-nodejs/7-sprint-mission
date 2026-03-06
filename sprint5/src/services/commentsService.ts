import { commentRepository } from '../repositories/commentsRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

export const commentService = {
  async updateComment(id: number, userId: number, content: string) {
    // 댓글 존재 검증
    const comment = await commentRepository.findById(id);
    if (!comment) throw new NotFoundError('comment', id);

    // 권한 검증
    if (comment.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the comment');
    }

    // 수정 후 결과 반환 => 필요한 정보만
    const updated = await commentRepository.update(id, { content });

    return {
      id: updated.id,
      content: updated.content,
      updatedAt: updated.updatedAt,
    };
  },

  async deleteComment(id: number, userId: number) {
    const comment = await commentRepository.findById(id);
    if (!comment) throw new NotFoundError('comment', id);

    if (comment.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the comment');
    }

    await commentRepository.delete(id);
  },
};
