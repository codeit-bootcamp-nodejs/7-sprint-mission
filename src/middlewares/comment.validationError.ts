import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';

export const validateComment = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      throw new ValidationError('댓글 내용은 문자열이 아니거나 비어있을 수 없습니다.');
    }
    next();
  } catch (e) {
    next(e);
  }
};
