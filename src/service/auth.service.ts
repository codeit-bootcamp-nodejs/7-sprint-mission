import bcrypt from 'bcrypt';
import User from '../model/user.model';
import type { AuthDto, LoginDto } from '../types/auth.type';
import { ValidationError } from '../errors/validationError';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from '../errors/forbiddenError';
import { NotFoundError } from '../errors/notFoundError';
import type { AuthPayload } from '../types/auth.type';
import {
  findRefreshTokenWithUser,
  findUserRepo,
  logoutRepo,
  rotateRefreshToken,
  saveRefreshToken,
  signupRepository,
} from '../repository/auth.repository';

// 회원가입 서비스
export const signupService = async (data: AuthDto) => {
  const { email, nickname, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const entity = await signupRepository(email, nickname, hashedPassword);

  return User.fromEntity(entity);
};

// 로그인 서비스
export const loginService = async (data: LoginDto) => {
  const { email, password } = data;

  const findUser = await findUserRepo(email);
  if (!findUser) throw new ValidationError('이메일 또는 비밀번호가 올바르지 않습니다.');
  const userId = findUser.id;

  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    throw new ValidationError('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const accessToken = jwt.sign(
    {
      userId: findUser.id.toString(),
      nickname: findUser.nickname,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' },
  );
  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET!, { expiresIn: '14d' });

  await saveRefreshToken(refreshToken, userId);

  return { accessToken, refreshToken };
};

// 리프레시 토큰 서비스
export const refreshService = async (refreshToken: string) => {
  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  } catch {
    throw new ValidationError('유효하지 않은 리프레시 토큰입니다.');
  }

  const stored = await findRefreshTokenWithUser(refreshToken);

  if (!stored) throw new ForbiddenError('유효하지 않은 토큰입니다.');
  if (stored.expiresAt < new Date()) throw new ForbiddenError('만료된 토큰입니다.');
  if (!stored.user) throw new NotFoundError('유저 정보를 찾을 수 없습니다.');

  // 새로운 토큰 발급
  const payload: AuthPayload = {
    userId: stored.userId.toString(),
    nickname: stored.user.nickname,
  };

  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  const newRefreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET!, { expiresIn: '14d' });

  // 기존 Refresh Token 삭제 후 새로 발급
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  await rotateRefreshToken(stored.id, stored.userId, newRefreshToken, expiresAt);

  return { newAccessToken, newRefreshToken };
};

// 로그아웃 서비스
export const logoutService = async (userId: bigint) => {
  await logoutRepo(userId);
  return true;
};
