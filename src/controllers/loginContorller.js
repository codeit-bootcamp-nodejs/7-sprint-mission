import bcrypt from 'bcrypt';
import UnauthorizedError from "../lib/errors/UnauthorizedError.js";
import { prismaClient } from '../lib/prismaClient.js';
import { generateAccessToken, generateRefreshToken } from '../lib/token.js';
import { LoginBodyStruct } from '../structs/authStruct.js';
import { create } from 'superstruct';

export async function login(req, res) {
  const { email, password } = create(req.body, LoginBodyStruct);
  const user = await prismaClient.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new UnauthorizedError('이메일이 일치하지 않습니다.');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
  }

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id);

  //refreshToken db에 저장 
  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      refreshToken: refreshToken
    }
  });
  //accessToken 
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000,
  })
  //refreshToken
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  //body로 전송 
  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    },
  })
}