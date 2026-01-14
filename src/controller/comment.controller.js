import prisma from '../../prisma/prisma.js';
import { NotFoundError } from '../errors/notFoundError.js';
import { ValidationError } from '../errors/validationError.js';
import { ForbiddenError } from '../errors/forbiddenError.js';

export const updateComment = async (req, res, next) => {
  try {
    const commentId = BigInt(req.params.commentId);

    const { content } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== BigInt(req.user.userId)) {
      throw new ForbiddenError('해당 댓글의 수정 권한이 없습니다.');
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).json({
      message: '댓글 수정 성공',
      data: {
        id: updated.id.toString(),
        content: updated.content,
        createdAt: updated.createdAt.toString(),
      },
    });
  } catch (e) {
    next(e);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = BigInt(req.params.commentId);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== BigInt(req.user.userId)) {
      throw new ForbiddenError('해당 댓글의 삭제 권한이 없습니다.');
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
