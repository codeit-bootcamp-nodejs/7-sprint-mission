import type { Request, Response, NextFunction } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { updateCommentService, deleteCommentService } from '../service/comment.service';
import type { CommentDto } from '../types/comment.type';

interface CommentParams extends ParamsDictionary {
  commentId: string;
}

// 댓글 수정 컨트롤러
export const updateComment = async (
  req: Request<CommentParams, {}, CommentDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const commentId = BigInt(req.params.commentId);
    const userId = BigInt(req.user!.userId);
    const { content } = req.body;

    const comment = await updateCommentService(commentId, userId, content);

    res.status(200).json({
      message: '댓글 수정 성공',
      data: {
        id: comment.id.toString(),
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      },
    });
  } catch (e) {
    next(e);
  }
};

// 댓글 삭제 컨트롤러
export const deleteComment = async (
  req: Request<CommentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const commentId = BigInt(req.params.commentId);
    const userId = BigInt(req.user!.userId);

    await deleteCommentService(commentId, userId);

    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
