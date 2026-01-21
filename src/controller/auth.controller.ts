import {
  signupService,
  loginService,
  refreshService,
  logoutService,
} from '../service/auth.service';
import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';
import type { AuthDto, LoginDto } from '../types/auth.type';

// 회원가입 컨트롤러
export const signup = async (req: Request<{}, {}, AuthDto>, res: Response, next: NextFunction) => {
  try {
    const newSignup = await signupService(req.body);

    res.status(201).json({ message: '회원가입 성공하였습니다.', data: newSignup });
  } catch (e) {
    next(e);
  }
};

// 로그인 컨트롤러
export const login = async (req: Request<{}, {}, LoginDto>, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = await loginService(req.body);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: '로그인 성공하였습니다.' });
  } catch (e) {
    next(e);
  }
};

// 리프레시 토큰 컨트롤러
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ValidationError('인증 정보가 없습니다. 다시 로그인 해주세요.');
    }

    const { newAccessToken, newRefreshToken } = await refreshService(refreshToken);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.cookie('accessToken', newAccessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      ...cookieOptions,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: '인증 정보가 갱신되었습니다.' });
  } catch (e) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    next(e);
  }
};

// 로그아웃 컨트롤러
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = BigInt(req.user!.userId);
    const nickname = req.user!.nickname;

    await logoutService(userId);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    // 2. 브라우저 쿠키 삭제
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    res.status(200).json({ message: `${nickname}님, 로그아웃 되었습니다.` });
  } catch (e) {
    next(e);
  }
};
