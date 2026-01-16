import { create } from 'superstruct';
import { commentService } from '../services/commentsService.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import type { Request, Response } from 'express';

export async function updateComment(req: Request, res: Response) {
  // 인증 확인
  if (!req.user) throw new UnauthorizedError('Unauthorized');

  // 입력 형식 검증
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct) as { content: string };

  // 서비스 호출 및 결과 응답
  const result = await commentService.updateComment(id, req.user.id, content);
  return res.send(result);
}

export async function deleteComment(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');

  const { id } = create(req.params, IdParamsStruct);

  await commentService.deleteComment(id, req.user.id);
  return res.status(204).send();
}
