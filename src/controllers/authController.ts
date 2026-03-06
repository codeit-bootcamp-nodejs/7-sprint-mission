import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { RegisterStruct, LoginStruct } from '../structs/authStructs';
import * as authService from '../services/authService';

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, RegisterStruct);
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, LoginStruct);
    const { accessToken, refreshToken, user } = await authService.login(
      req.body.email,
      req.body.password
    );
    res.cookie('accessToken', accessToken, { ...COOKIE_OPTS, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: '로그아웃 되었습니다' });
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
    if (!token) {
      res.status(401).json({ message: '리프레시 토큰이 필요합니다' });
      return;
    }
    const { accessToken, refreshToken } = await authService.refresh(token);
    res.cookie('accessToken', accessToken, { ...COOKIE_OPTS, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}
