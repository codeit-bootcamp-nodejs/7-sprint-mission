import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';

export function generateTokens(userId) {
  //'id 일치하는거, 토큰, 만료시간'
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

// access token 검증
export function verifyAccessToken(token) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { userId: decoded.id };
}

//refresh token 검증
export function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  return { userId: decoded.id };
}
