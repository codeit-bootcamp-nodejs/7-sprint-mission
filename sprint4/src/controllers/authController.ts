import { Request, Response } from 'express';
import { prismaClient } from '../lib/prismaClient.js';
import { UserRepository } from '../repositories/userRepository.js';
import { AuthService } from '../services/authService.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV,
} from '../lib/constants.js';

// Initialize repositories and services
const userRepository = new UserRepository(prismaClient);
const authService = new AuthService(userRepository);

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const userWithoutPassword = await authService.register(data);

  res.status(201).json(userWithoutPassword);
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const { tokens } = await authService.login(data);

  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
  res.status(200).send();
}

export async function logout(_req: Request, res: Response) {
  clearTokenCookies(res);
  res.status(200).send();
}

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  
  if (!refreshToken) {
    throw new BadRequestError('Invalid refresh token');
  }

  const tokens = await authService.refreshAccessToken(refreshToken);
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
  
  res.status(200).send();
}

function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
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

function clearTokenCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}
