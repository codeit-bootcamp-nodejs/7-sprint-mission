import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../lib/prismaClient.js';
import { BadRequestError } from '../lib/errors/BadRequestError.js';

export const signUp = async (req, res) => {
  const { email, nickname, password } = req.body;

  if (!email || !nickname || !password) {
    throw new BadRequestError('이메일, 닉네임, 비밀번호는 필수입니다.');
  }
  
  const existingUser = await prismaClient.user.findUnique({ where: { email } });
  if (existingUser) throw new BadRequestError('이미 사용 중인 이메일입니다.');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prismaClient.user.create({
    data: { email, nickname, password: hashedPassword },
    select: { id: true, email: true, nickname: true, createdAt: true },
  });
  res.status(201).json(user);
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new BadRequestError('이메일 또는 비밀번호가 일치하지 않습니다.');
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  await prismaClient.user.update({ where: { id: user.id }, data: { refreshToken } });
  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, nickname: user.nickname } });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new BadRequestError('Refresh Token이 필요합니다.');

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prismaClient.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== refreshToken) throw new Error();

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

export const getMe = async (req, res) => {
  const user = await prismaClient.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, nickname: true, image: true, createdAt: true },
  });
  res.json(user);
};

export const updateMe = async (req, res) => {
  const { nickname, image } = req.body;
  const user = await prismaClient.user.update({
    where: { id: req.user.id },
    data: { nickname, image },
    select: { id: true, email: true, nickname: true, image: true },
  });
  res.json(user);
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prismaClient.user.findUnique({ where: { id: req.user.id } });
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new BadRequestError('현재 비밀번호가 일치하지 않습니다.');
  }

  await prismaClient.user.update({
    where: { id: req.user.id },
    data: { password: await bcrypt.hash(newPassword, 10) },
  });
  res.status(204).send();
};

export const getMyProducts = async (req, res) => {
  const products = await prismaClient.product.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(products);
};