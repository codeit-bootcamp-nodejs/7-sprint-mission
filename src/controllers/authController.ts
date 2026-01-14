import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { prismaClient } from '../lib/prismaClient.js';
import { generateAccessToken, verifyRefreshToken } from '../lib/token.js';
import { Request, Response } from 'express';
import { NODE_ENV } from '../lib/constants.js';

export async function refreshAccessToken(req: Request, res: Response) {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    throw new UnauthorizedError('리프레시 토큰이 없습니다. 다시 로그인 해주세요.');
  }

  try {
    //토큰 복호화
    const { userId } = verifyRefreshToken(refreshToken);

    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError('유효하지 않은 리프레시 토큰입니다.');
    }

    const cookieOptions = {
      httpOnly: true,
      secure: NODE_ENV === 'production',
    };

    const newAccessToken = generateAccessToken(user.id);
    res.cookie('accessToken', newAccessToken, {
      ...cookieOptions,
      maxAge: 1 * 60 * 60 * 1000,
    });
    return res.status(200).json({ mesagge: ' 엑세스 토큰이 갱신되었습니다.' });
  } catch (error) {
    throw new UnauthorizedError('리프레시 토큰이 만료되었습니다.');
  }
}
