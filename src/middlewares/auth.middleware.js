import { ValidationError } from '../errors/validationError.js';
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new ValidationError('로그인 후 이용가능합니다.');
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new ValidationError('잘못된 인증 형식입니다.');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new ValidationError('토큰이 없습니다.');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    next(e);
  }
};

export default auth;
