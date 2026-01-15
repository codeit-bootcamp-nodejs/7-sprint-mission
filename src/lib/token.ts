import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants';

interface UserPayload extends JwtPayload {
  id: number;
}

export function generateTokens(userId: number) {
  if (!JWT_ACCESS_TOKEN_SECRET || !JWT_REFRESH_TOKEN_SECRET) {
    throw new Error('JWT 환경 변수가 설정되지 않았습니다.');
  }

  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET as string) as UserPayload;

  return { userId: decoded.id };
}

export function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET as string) as UserPayload;
  return { userId: decoded.id };
}
