import type { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import { generateTokens, verifyRefreshToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, NODE_ENV } from '../lib/constants';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs';
import BadRequestError from '../lib/errors/BadRequestError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export async function register(req: Request, res: Response) {
  const { email, nickname, password } = create(req.body, RegisterBodyStruct);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const isExist = await prismaClient.user.findUnique({ where: { email } });
  if (isExist) {
    throw new BadRequestError('User already exists');
  }

  const user = await prismaClient.user.create({
    data: { email, nickname, password: hashedPassword },
  });

  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);

  const { password: _, ...userWithoutPassword } = user;
  return res.status(201).send(userWithoutPassword);
}

export async function login(req: Request, res: Response) {
  const { email, password } = create(req.body, LoginBodyStruct);

  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);

  const { password: _, ...userWithoutPassword } = user;
  return res.status(200).send(userWithoutPassword);
}

export async function logout(req: Request, res: Response) {
  clearTokenCookies(res);
  return res.status(200).send();
}

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!token) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  try {
    const { userId } = verifyRefreshToken(token);

    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId);
    setTokenCookies(res, accessToken, newRefreshToken);
    return res.status(200).send();
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
}

function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000,
    path: '/',
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearTokenCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { path: '/' });
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
}
