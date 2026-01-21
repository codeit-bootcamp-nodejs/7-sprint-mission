import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import { Request, Response } from 'express';
import { UpdateCommentBodyStruct, UpdateCommentBody } from '../structs/commentsStruct.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct, IdParams } from '../structs/commonStructs.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as IdParams;
  const { content } = create(req.body, UpdateCommentBodyStruct) as UpdateCommentBody;

  const existingComment = await prismaClient.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }
  if (existingComment.userId !== req.user!.id) {
    throw new ForbiddenError('댓글 수정 권한이 없습니다.');
  }
  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
  });

  return res.send(updatedComment);
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as IdParams;

  const existingComment = await prismaClient.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }
  if (existingComment.userId !== req.user!.id) {
    throw new ForbiddenError('댓글 삭제 권한이 없습니다.');
  }
  await prismaClient.comment.delete({ where: { id } });

  return res.status(204).send();
}
