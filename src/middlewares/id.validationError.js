import { ValidationError } from '../errors/validationError.js';

export const validateProductId = (req, res, next) => {
  const { productId } = req.params;

  if (!/^[1-9]\d*$/.test(productId)) {
    throw new ValidationError('요청 ID는 양의 정수여야 합니다.');
  }

  next();
};

export const validateArticleId = (req, res, next) => {
  const { articleId } = req.params;

  if (!/^[1-9]\d*$/.test(articleId)) {
    throw new ValidationError('요청 ID는 양의 정수여야 합니다.');
  }

  next();
};

export const validateCommentId = (req, res, next) => {
  const { commentId } = req.params;

  if (!/^[1-9]\d*$/.test(commentId)) {
    throw new ValidationError('요청 ID는 양의 정수여야 합니다.');
  }

  next();
};
