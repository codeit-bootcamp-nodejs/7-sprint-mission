import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';

const validateId = (id: unknown) => {
  if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
    throw new ValidationError('요청 ID는 양의 정수여야 합니다.');
  }
};

const createIdValidator = (paramName: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const id = req.params[paramName];
      validateId(id);
      next();
    } catch (e) {
      next(e);
    }
  };
};

export const validateProductId = createIdValidator('productId');
export const validateArticleId = createIdValidator('articleId');
export const validateCommentId = createIdValidator('commentId');
