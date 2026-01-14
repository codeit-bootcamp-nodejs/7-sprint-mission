import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { prismaClient } from '../lib/prismaClient.js';
import { generateAccessToken, generateRefreshToken } from '../lib/token.js';
import { LoginBodyStruct, LoginBody } from '../structs/authStruct.js';
import { create } from 'superstruct';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, NODE_ENV } from '../lib/constants.js';

export async function login(req: Request, res: Response) {
  const { email, password } = create(req.body, LoginBodyStruct) as LoginBody;
  //유저 확인
  const user = await prismaClient.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new UnauthorizedError('이메일이 일치하지 않습니다.');
  }
  //비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  //refreshToken db에 저장
  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      refreshToken: refreshToken,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
  };

  //accessToken
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    ...cookieOptions,
    maxAge: 1 * 60 * 60 * 1000,
  });
  //refreshToken
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  //body로 전송
  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    },
  });
}
