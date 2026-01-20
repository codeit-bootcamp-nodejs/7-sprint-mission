import { User } from '@prisma/client';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import * as commentRepository from '../repositories/commentRepository';

export async function updateComment(commentId: number, content: string, user: User) {
  // Implementation here
  
  const existingComment = await commentRepository.getCommentById(commentId);
  if (!existingComment) {
    throw new NotFoundError('comment', commentId);
  }

  if (existingComment.userId !== user.id) {
    throw new ForbiddenError('Should be the owner of the comment');
  }
  const updatedComment = await commentRepository.updateComment(commentId, content);
  return updatedComment;
}

export async function deleteComment(commentId: number, user: User) {
  // Implementation here
  const existingComment = await commentRepository.getCommentById(commentId);
  if (!existingComment) {
    throw new NotFoundError('comment', commentId);
  }

  if (existingComment.userId !== user.id) {
    throw new ForbiddenError('Should be the owner of the comment');
  }
  return commentRepository.deleteComment(commentId);
}   