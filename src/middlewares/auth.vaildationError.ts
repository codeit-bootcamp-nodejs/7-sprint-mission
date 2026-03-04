import prisma from '../../prisma/prisma';
import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';

export const validateSignup = async (req: Request, _res: Response, next: NextFunction) => {
  const { email, nickname, password } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new ValidationError('유효한 이메일 형식이 아닙니다.');
  }

  if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
    throw new ValidationError('닉네임은 필수이며 문자열이어야 합니다.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new ValidationError('비밀번호는 필수이며 최소 8자 이상이어야 합니다.');
  }

  const [existingEmail, existingNickname] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { nickname } }),
  ]);

  if (existingEmail) {
    throw new ValidationError('이미 사용 중인 이메일입니다.');
  }

  if (existingNickname) {
    throw new ValidationError('이미 사용 중인 닉네임입니다.');
  }

  next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new ValidationError('이메일은 필수입니다.');
  }

  if (!password || typeof password !== 'string') {
    throw new ValidationError('비밀번호는 필수입니다.');
  }

  next();
};
