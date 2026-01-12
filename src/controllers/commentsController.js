import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';

export const updateComment = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const comment = await prismaClient.comment.findUnique({ where: { id } });
  if (!comment) throw new NotFoundError('comment', id);
  if (comment.userId !== req.user.id) return res.status(403).json({ message: '권한이 없습니다.' });

  const updated = await prismaClient.comment.update({ where: { id }, data: { content } });
  res.json(updated);
};

export const deleteComment = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const comment = await prismaClient.comment.findUnique({ where: { id } });
  if (!comment) throw new NotFoundError('comment', id);
  if (comment.userId !== req.user.id) return res.status(403).json({ message: '권한이 없습니다.' });

  await prismaClient.comment.delete({ where: { id } });
  res.status(204).send();
};