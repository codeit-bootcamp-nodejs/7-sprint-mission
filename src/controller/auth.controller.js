import prisma from '../../prisma/prisma.js';
import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import { ValidationError } from '../errors/validationError.js';
import { ForbiddenError } from '../errors/forbiddenError.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSignup = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });

    const entitySignup = User.fromEntity(newSignup);
    res.status(201).json({ message: '회원가입 성공하였습니다.', data: entitySignup });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!findUser) {
      throw new ValidationError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (!passwordMatch) {
      throw new ValidationError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const accessPayload = {
      userId: findUser.id.toString(),
    };

    const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '14d',
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: findUser.id,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      message: '로그인 성공하였습니다.',
      data: { accessToken, refreshToken },
    });
  } catch (e) {
    next(e);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh Token이 필요합니다.');
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored) {
      throw new ForbiddenError('유효하지 않은 토큰입니다.');
    }

    if (stored.expiresAt < new Date()) {
      throw new ForbiddenError('만료된 토큰입니다.');
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 새 Access Token 발급
    const newAccessToken = jwt.sign({ userId: stored.user.id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Access Token 재발급 성공',
      accessToken: newAccessToken,
    });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh Token이 필요합니다.');
    }

    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    res.status(200).json({
      message: '로그아웃 성공',
    });
  } catch (e) {
    next(e);
  }
};
