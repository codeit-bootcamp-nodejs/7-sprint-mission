import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { User } from '@prisma/client';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

    if (!accessToken) {
      throw new UnauthorizedError('액세스 토큰이 존재하지 않습니다.');
    }
    //토큰 복호화
    const { userId } = verifyAccessToken(accessToken);
    // db에서 유저 조회
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedError('존재하지 않는 유저입니다.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('토큰이 만료되었습니다. 재발급이 필요합니다.');
      }
      next(error);
    }
  }
}

export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      return next();
    }
    const { userId } = verifyAccessToken(accessToken);

    //DB에서 유저 조회
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    // 유저가 존재하면 req.user에 담아줌
    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
}
