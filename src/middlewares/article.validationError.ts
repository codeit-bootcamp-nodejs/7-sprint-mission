import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';

export const validationArticleCreate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new ValidationError('제목은 비어있을 수 없습니다.');
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      throw new ValidationError('내용은 비어있을 수 없습니다.');
    }
    next();
  } catch (e) {
    next(e);
  }
};

export const validationArticleUpdate = (req: Request, _res: Response, next: NextFunction) => {
  const { title, content } = req.body;
  try {
    // 아무 것도 안 보냈을 때
    if (title === undefined && content === undefined) {
      throw new ValidationError('수정할 항목이 없습니다.');
    }

    // title이 있을 때만 검증
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        throw new ValidationError('제목은 비어있을 수 없습니다.');
      }
    }

    // content가 있을 때만 검증
    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim() === '') {
        throw new ValidationError('내용은 비어있을 수 없습니다.');
      }
    }
    next();
  } catch (e) {
    next(e);
  }
};
