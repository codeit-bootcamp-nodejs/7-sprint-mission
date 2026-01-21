import { ForbiddenError } from '../errors/forbiddenError';
import { NotFoundError } from '../errors/notFoundError';
import {
  deleteCommentRepo,
  findComment,
  updateCommentRepo,
} from '../repository/comment.repository';

// 댓글 수정 서비스
export const updateCommentService = async (commentId: bigint, userId: bigint, content: string) => {
  const comment = await findComment(commentId);

  if (!comment) throw new NotFoundError('댓글을 찾을 수 없습니다.');
  if (comment.userId !== userId) throw new ForbiddenError('해당 댓글의 수정 권한이 없습니다.');

  const updatedComment = await updateCommentRepo(commentId, content);

  return updatedComment;
};

// 댓글 삭제 서비스
export const deleteCommentService = async (commentId: bigint, userId: bigint): Promise<void> => {
  const comment = await findComment(commentId);

  if (!comment) throw new NotFoundError('댓글을 찾을 수 없습니다.');
  if (comment.userId !== userId) throw new ForbiddenError('해당 댓글의 삭제 권한이 없습니다.');

  await deleteCommentRepo(commentId);
};
