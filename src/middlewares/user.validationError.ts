import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prisma';

export const validateUpdateProfile = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { nickname } = req.body;

    if (nickname === undefined && !req.file) {
      throw new ValidationError('수정할 필드가 없습니다.');
    }

    if (nickname !== undefined) {
      if (typeof nickname !== 'string') {
        throw new ValidationError('닉네임은 문자열이어야 합니다.');
      }

      if (nickname.trim() === '') {
        throw new ValidationError('닉네임은 비어있을 수 없습니다.');
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { nickname: nickname.trim() },
    });

    if (existingUser) {
      throw new ValidationError('이미 사용 중인 닉네임입니다.');
    }

    next();
  } catch (e) {
    next(e);
  }
};

export const validateChangePassword = (req: Request, _res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('비밀번호를 모두 입력해야 합니다.');
  }

  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    throw new ValidationError('비밀번호는 문자열이어야 합니다.');
  }

  if (currentPassword === newPassword) {
    throw new ValidationError('새 비밀번호는 기존 비밀번호와 달라야 합니다.');
  }

  if (newPassword.length < 8 || newPassword.length > 15) {
    throw new ValidationError('비밀번호는 최소 8자 이상, 최대 15자 이하여야 합니다.');
  }

  next();
};
