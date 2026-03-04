import prisma from '../../prisma/prisma';

export const findComment = async (commentId: bigint) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  return comment;
};

export const updateCommentRepo = async (commentId: bigint, content: string) => {
  const updateComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
  return updateComment;
};

export const deleteCommentRepo = async (commentId: bigint): Promise<void> => {
  await prisma.comment.delete({ where: { id: commentId } });
};
