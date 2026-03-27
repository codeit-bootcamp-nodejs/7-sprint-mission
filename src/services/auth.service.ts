import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../config/jwt';
import * as userRepo from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { toUserDto, UserResponseDto } from '../dtos/user.dto';
import { BCRYPT_ROUNDS } from '../config/env';

export async function register(data: {
  email: string;
  nickname: string;
  password: string;
}): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string }> {
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) throw new ApiError(409, 'Email already in use');

  const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const user = await userRepo.createUser({
    email: data.email,
    nickname: data.nickname,
    password: hashedPassword,
  });

  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await userRepo.updateRefreshToken(user.id, refreshToken);

  return { user: toUserDto(user), accessToken, refreshToken };
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string }> {
  const user = await userRepo.findUserByEmail(data.email);
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await userRepo.updateRefreshToken(user.id, refreshToken);

  return { user: toUserDto(user), accessToken, refreshToken };
}

export async function refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
  let payload: { userId: number; email: string };
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await userRepo.findUserById(payload.userId);
  if (!user || user.refreshToken !== token) throw new ApiError(401, 'Refresh token mismatch');

  const newPayload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(newPayload);
  const refreshToken = signRefreshToken(newPayload);
  await userRepo.updateRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
}
