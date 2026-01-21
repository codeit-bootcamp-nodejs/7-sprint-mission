import { Request, Response } from 'express';
import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {commentService} from '../services/commentService';
import { AuthenticatedRequest } from '../types/express';

export async function updateComment(req: Request, res: Response) {
  const {user, body, params} = req as AuthenticatedRequest;
  const { id } = create(params, IdParamsStruct);
  const data = create(body, UpdateCommentBodyStruct);
  const updated = await commentService.updateComment(user.id, id, data);
  return res.send(updated);
}

export async function deleteComment(req: Request, res: Response) {
  const {user, params} = req as AuthenticatedRequest;
  const { id } = create(params, IdParamsStruct);
  await commentService.deleteComment(user.id, id);
  return res.status(204).send();
}
