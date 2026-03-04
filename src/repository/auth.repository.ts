import prisma from '../../prisma/prisma';

//유저 존재여부 확인용
export const findUserRepo = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

//회원가입
export const signupRepository = async (email: string, nickname: string, hashedPassword: string) => {
  const signup = await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });
  return signup;
};

//리프레시 토큰 저장
export const saveRefreshToken = async (refreshToken: string, userId: bigint): Promise<void> => {
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });
};

//기존 refreshToken 확인
export const findRefreshTokenWithUser = async (refreshToken: string) => {
  const findRefreshToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  return findRefreshToken;
};

//기존 refreshToken 삭제 및 재발급
export const rotateRefreshToken = async (
  oldTokenId: bigint,
  userId: bigint,
  newToken: string,
  expiresAt: Date,
): Promise<void> => {
  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { id: oldTokenId } }),
    prisma.refreshToken.create({
      data: {
        token: newToken,
        userId: userId,
        expiresAt: expiresAt,
      },
    }),
  ]);
};

//로그아웃
export const logoutRepo = async (userId: bigint): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { userId: userId } });
};
