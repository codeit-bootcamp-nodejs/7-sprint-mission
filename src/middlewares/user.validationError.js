import { ValidationError } from '../errors/validationError.js';

export const validateUpdateProfile = (req, res, next) => {
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

  next();
};

export const validateChangePassword = (req, res, next) => {
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

  if (newPassword.length < 8) {
    throw new ValidationError('비밀번호는 최소 8자 이상이어야 합니다.');
  }

  if (newPassword.length > 15) {
    throw new ValidationError('비밀번호는 최대 15자 이하여야 입니다.');
  }

  next();
};
