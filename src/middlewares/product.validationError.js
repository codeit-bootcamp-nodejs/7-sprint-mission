import { ValidationError } from '../errors/validationError.js';

export const validateProductCreate = (req, res, next) => {
  const { name, description, price, tags } = req.body;

  if (!name || typeof name !== 'string') {
    throw new ValidationError('상품 이름은 필수입니다.');
  }

  if (!description || typeof description !== 'string') {
    throw new ValidationError('상품 설명은 필수입니다.');
  }

  if (typeof price !== 'number' || price < 0) {
    throw new ValidationError('가격은 0 이상의 숫자여야 합니다.');
  }

  if (tags && !Array.isArray(tags)) {
    throw new ValidationError('태그는 배열이어야 합니다.');
  }

  next();
};

export const validationProductUpdate = (req, res, next) => {
  const { name, description, price, tags } = req.body;

  if (
    name === undefined &&
    description === undefined &&
    price === undefined &&
    tags === undefined
  ) {
    throw new ValidationError('수정할 필드가 없습니다.');
  }

  if (name !== undefined && typeof name !== 'string') {
    throw new ValidationError('상품 이름은 문자열이어야 합니다.');
  }

  if (description !== undefined && typeof description !== 'string') {
    throw new ValidationError('상품 설명은 문자열이어야 합니다.');
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new ValidationError('가격은 0 이상의 숫자여야 합니다.');
    }
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    throw new ValidationError('tags는 배열이어야 합니다.');
  }

  next();
};
