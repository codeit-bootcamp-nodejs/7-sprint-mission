import bcrypt from 'bcrypt';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStruct.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';

// 2. 회원가입 API를 만들어 주세요.
// 2-1. email, nickname, password 를 입력하여 회원가입을 진행합니다.
// 2-2. password는 해싱해 저장합니다.
export async function register(req, res) {
  try {
    const { email, nickname, password } = create(req.body, RegisterBodyStruct);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount = await prismaClient.user.count({ where: { email } });
    if (userCount > 0) {
      throw new BadRequestError('email already in use');
    }
    const nicknameCount = await prismaClient.user.count({ where: { nickname } });
    if (nicknameCount > 0) {
      throw new BadRequestError('nickname already in use');
    }

    const user = await prismaClient.user.create({
      data: { email, nickname, password: hashedPassword },
    });
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({ userWithoutPassword });
  } catch (error) {
    next(error);
  }
}
// 1. 로그인한 유저만 상품을 등록할 수 있습니다.
export async function login(req, res) {
  const { email, password } = create(req.body, LoginBodyStruct);
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError('이메일이 잘못되었습니다.');
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new BadRequestError('비밀번호가 잘못되었습니다.');
  }
  // 3. 토큰 기반 인증: 로그인에 성공하면 Access Token을 발급하는 기능을 구현합니다.
  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);
  return res.status(201).json('로그인 성공');
}
// ## 인증
// ### 토큰 기반 인증: Refresh Token으로 토큰을 갱신하는 기능을 구현합니다.
// [심화] Refresh Token으로 토큰 갱신
export async function refresh(req, res) {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) throw new BadRequestError('리프레시 토큰이 없습니다.');

  try {
    const { userId } = verifyRefreshToken(refreshToken);
    const tokens = generateTokens(userId);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return res.status(200).json({ message: '토큰 갱신 성공' });
  } catch (e) {
    throw new BadRequestError('유효하지 않은 리프레시 토큰입니다.');
  }
}

// 유저 정보 조회 (비밀번호 제외)
export async function getMe(req, res) {
  // req.user는 authenticate 미들웨어에서 넣어줌
  const { password, ...userWithoutPassword } = req.user;
  return res.send(userWithoutPassword);
}
// 2. 상품을 등록한 유저만 해당 상품의 정보를 수정하거나 삭제할 수 있습니다.

// 유저 정보 수정
export async function updateMe(req, res) {
  const { nickname, image } = req.body;
  const updatedUser = await prismaClient.user.update({
    where: { id: req.user.id },
    data: { nickname, image },
  });
  const { password, ...userWithoutPassword } = updatedUser;
  return res.send(userWithoutPassword);
}

// 비밀번호 변경
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  const isMatch = await bcrypt.compare(currentPassword, req.user.password);
  if (!isMatch) throw new BadRequestError('현재 비밀번호가 일치하지 않습니다.');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prismaClient.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });
  return res.send({ message: '비밀번호 변경 성공' });
}

// 유저가 등록한 상품 목록 조회
export async function getMyProducts(req, res) {
  const products = await prismaClient.product.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  return res.send(products);
}

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1시간
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    path: '/auth/refresh',
  });
}

// 로그아웃
export async function logout(req, res) {
  clearTokenCookies(res);
  res.status(201).json('로그아웃 성공');
  function clearTokenCookies(res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    // path 옵션이 들어간 쿠키는 지울 때도 path를 명시하는 것이 안전함
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/auth/refresh' });
  }
}
