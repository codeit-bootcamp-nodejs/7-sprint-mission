import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';

interface TokenPayload {
  id: number;
}

export function generateTokens(userId: number): { accessToken: string; refreshToken: string } {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): { userId: number } {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as TokenPayload;
  return { userId: decoded.id };
}

export function verifyRefreshToken(token: string): { userId: number } {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as TokenPayload;
  return { userId: decoded.id };
}
