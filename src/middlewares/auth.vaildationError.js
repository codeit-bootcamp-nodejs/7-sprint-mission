import prisma from '../../prisma/prisma.js';
import { ValidationError } from '../errors/validationError.js';

export const validateSignup = async (req, res, next) => {
  const { email, nickname, password } = req.body;

  if (!email || typeof email !== 'string') {
    throw new ValidationError('이메일은 필수입니다.');
  }

  if (!nickname || typeof nickname !== 'string') {
    throw new ValidationError('닉네임은 필수입니다.');
  }

  if (!password || typeof password !== 'string') {
    throw new ValidationError('비밀번호는 필수입니다.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ValidationError('중복된 이메일입니다.');
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    throw new ValidationError('이메일은 필수입니다.');
  }

  if (!password || typeof password !== 'string') {
    throw new ValidationError('비밀번호는 필수입니다.');
  }

  next();
};
