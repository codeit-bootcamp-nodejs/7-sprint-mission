import { UnauthorizedError } from "../../errors/customErrors.js";
import { signRefreshToken, verifyRefreshToken, signAccessToken } from "../../utils/token.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";

import type { RegisterDto, LoginDto, RefreshDto } from "../dtos/auth.dto.js";
import * as authRepository from "../repositories/auth.repository.js";

export type SafeUser = {
  id: string;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterResult = {
  user: SafeUser;
  accessToken: string;
};

export type LoginResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

export type RefreshResult = {
  accessToken: string;
};

const safeUser = (user: {
  id: bigint;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser => ({
  id: user.id.toString(),
  email: user.email,
  nickname: user.nickname,
  image: user.image ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const register = async (dto: RegisterDto): Promise<RegisterResult> => {
  const passwordHash = await hashPassword(dto.password);

  const user = await authRepository.createUser({
    email: dto.email,
    nickname: dto.nickname,
    passwordHash,
  });

  const accessToken = signAccessToken({ userId: user.id.toString() });

  return { user: safeUser(user), accessToken };
};

export const login = async (dto: LoginDto): Promise<LoginResult> => {
  const user = await authRepository.findUserByEmail(dto.email);
  if (!user) throw new UnauthorizedError("이메일 또는 비밀번호가 올바르지 않습니다.");

  const ok = await verifyPassword(dto.password, user.password);
  if (!ok) throw new UnauthorizedError("이메일 또는 비밀번호가 올바르지 않습니다.");

  const accessToken = signAccessToken({ userId: user.id.toString() });
  const refreshToken = signRefreshToken({ userId: user.id.toString() });

  const refreshTokenHash = await hashPassword(refreshToken);

  await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  return { user: safeUser(user), accessToken, refreshToken };
};

export const refresh = async (dto: RefreshDto): Promise<RefreshResult> => {
  let payload: { userId: string };

  try {
    payload = verifyRefreshToken(dto.refreshToken);
  } catch {
    throw new UnauthorizedError("로그인 정보가 올바르지 않습니다.");
  }

  const records = await authRepository.findValidRefreshTokenHashesByUserId(BigInt(payload.userId));
  if (records.length === 0) throw new UnauthorizedError("로그인 정보가 올바르지 않습니다.");

  const checks = await Promise.all(records.map((r) => verifyPassword(dto.refreshToken, r.tokenHash)));
  if (!checks.some(Boolean)) throw new UnauthorizedError("로그인 정보가 올바르지 않습니다.");

  const accessToken = signAccessToken({ userId: payload.userId });
  return { accessToken };
};
