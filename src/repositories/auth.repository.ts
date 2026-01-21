import { prisma } from "../../prisma/prisma.js";

export const createUser = async (data: {
  email: string;
  nickname: string;
  passwordHash: string;
}) => {
  return prisma.user.create({
    data: {
      email: data.email,
      nickname: data.nickname,
      password: data.passwordHash,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createRefreshToken = async (data: {
  userId: bigint;
  tokenHash: string;
  expiresAt: Date;
}) => {
  return prisma.refreshToken.create({
    data: {
      user_id: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
    },
  });
};

export const findValidRefreshTokenHashesByUserId = async (userId: bigint) => {
  return prisma.refreshToken.findMany({
    where: {
      user_id: userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: { tokenHash: true },
  });
};
