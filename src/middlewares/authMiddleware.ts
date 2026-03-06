import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import * as userRepository from '../repositories/userRepository';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token =
    req.cookies?.accessToken ??
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: '인증이 필요합니다' });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await userRepository.findUserById(payload.userId);
    if (!user) {
      res.status(401).json({ message: '사용자를 찾을 수 없습니다' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: '유효하지 않거나 만료된 토큰입니다' });
  }
}
