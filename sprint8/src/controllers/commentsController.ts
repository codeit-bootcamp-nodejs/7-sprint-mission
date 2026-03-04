import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
export async function updateComment(req : Request, res : Response ) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const updatedComment = await commentService.updateComment(id, content!, req.user);
  return res.send(updatedComment);
}

export async function deleteComment(req : Request, res : Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const { id } = create(req.params, IdParamsStruct);
  await commentService.deleteComment(id, req.user);
  return res.status(204).send();
}
