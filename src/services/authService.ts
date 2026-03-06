import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { toUserDto } from '../dto/userDto';

export async function register(data: {
  email: string;
  nickname: string;
  password: string;
  image?: string;
}) {
  const existing = await userRepository.findUserByEmail(data.email);
  if (existing) {
    const error = new Error('이미 사용 중인 이메일입니다');
    (error as any).status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await userRepository.createUser({ ...data, password: hashedPassword });
  return toUserDto(user);
}

export async function login(email: string, password: string) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    (error as any).status = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    (error as any).status = 401;
    throw error;
  }

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  return { accessToken, refreshToken, user: toUserDto(user) };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await userRepository.findUserById(payload.userId);
  if (!user) {
    const error = new Error('사용자를 찾을 수 없습니다');
    (error as any).status = 401;
    throw error;
  }
  const accessToken = signAccessToken({ userId: user.id });
  const newRefreshToken = signRefreshToken({ userId: user.id });
  return { accessToken, refreshToken: newRefreshToken };
}
