import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV,
} from '../lib/constants.js';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export async function register(req, res) {
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

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
}

export async function login(req, res) {
  const { email, password } = create(req.body, LoginBodyStruct);

  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).send();
}

export async function logout(req, res) {
  clearTokenCookies(res);
  res.status(200).send();
}

export async function refreshToken(req, res) {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { userId } = verifyRefreshToken(refreshToken);

  const user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId);
  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(200).send();
}

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/auth/refresh',
  });
}

function clearTokenCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}
