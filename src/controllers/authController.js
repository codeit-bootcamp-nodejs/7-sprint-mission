import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import bcrypt from "bcrypt";
import NotFoundError from "../lib/errors/NotFoundError.js";
import BadRequestError from "../lib/errors/BadRequestError.js";
import { RegisterBodyStruct, LoginBodyStruct } from "../structs/authStructs.js";
import { generateTokens } from "../lib/token.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../lib/constants.js";
export async function register(req, res) {
  const { email, nickname, password } = create(req.body, RegisterBodyStruct);

  const existingEmail = await prismaClient.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    throw new BadRequestError("Email이 중복되었습니다.");
  }

  const existingNickname = await prismaClient.user.findUnique({
    where: { nickname },
  });
  if (existingNickname) {
    throw new BadRequestError("Nickname이 중복되었습니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prismaClient.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });
  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
}
export async function login(req, res) {
  const { email, password } = create(req.body, LoginBodyStruct);
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError("Wrong email or password");
  }
  const isPasswordVaild = await bcrypt.compare(password, user.password);
  if (!isPasswordVaild) {
    throw new BadRequestError("Wrong password");
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).send({ message: "Login successful" });
}
function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/auth/refresh",
  });
}
export async function logout(req, res) {
  clearTokenCookies(res);
  res.status(200).send({ message: "Logout successful" });
}
function clearTokenCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}
export async function refreshTokens(req, res) {
  const { accessToken, refreshToken } = generateTokens(req.user.id);
  setTokenCookies(res, accessToken, refreshToken);
  res.json({ message: "Tokens refreshed successfully" });
}
