import { create } from 'superstruct';
import { authService } from '../services/authsService.js';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs.js';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, NODE_ENV } from '../lib/constants.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import type { Request, Response } from 'express';

// 쿠키 설정 헬퍼 함수는 컨트롤러 내부 혹은 별도 유틸로 유지
function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000,
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth/refresh',
  });
}

export async function register(req: Request, res: Response) {
  const data = create(req.body, RegisterBodyStruct);
  const user = await authService.register(data);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const { email, password } = create(req.body, LoginBodyStruct);
  const { accessToken, refreshToken } = await authService.login(email, password);

  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).send();
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  res.status(200).send();
}

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!token) throw new BadRequestError('Invalid refresh token');

  const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(token);

  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(200).send();
}
