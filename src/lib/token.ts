import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';

// Access Token
export function generateAccessToken(userId: number) {
  return jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET!, { expiresIn: '1h' });
}

// Refresh Token
export function generateRefreshToken(userId: number) {
  return jwt.sign({ userId }, JWT_REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}

interface DecodedToken extends JwtPayload {
  userId: number;
}
//토큰 복호화
export function verifyAccessToken(token: string): DecodedToken {
  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET!) as DecodedToken;
}

export function verifyRefreshToken(token: string): DecodedToken {
  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET!) as DecodedToken;
}
