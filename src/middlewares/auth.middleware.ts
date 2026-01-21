import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/unauthenticatedError';
import type { AuthPayload } from '../types/auth.type';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new UnauthenticatedError('로그인 후 이용가능합니다.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

    req.user = decoded;
    next();
  } catch (e) {
    res.clearCookie('accessToken');
    next(e);
  }
};

export const authenticateUserOptional = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  // 토큰이 없어도 에러를 던지지 않고 그냥 next()로 보냅니다.
  if (!token) {
    req.user = undefined;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    // 토큰이 유효하지 않아도 조회는 가능해야 하므로 에러 대신 유저 정보만 비우고 넘깁니다.
    req.user = undefined;
    next();
  }
};
