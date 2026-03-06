import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { UpdateCommentStruct } from '../structs/commentStructs';
import * as commentService from '../services/commentService';

export async function updateComment(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, UpdateCommentStruct);
    const comment = await commentService.updateComment(
      parseInt(req.params.id),
      req.user!.id,
      req.body.content
    );
    res.json(comment);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    await commentService.deleteComment(parseInt(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
