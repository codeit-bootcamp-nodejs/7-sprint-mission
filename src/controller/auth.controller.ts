import { AuthService } from '../service/auth.service';
import { ValidationError } from '../errors/validationError';
import type { Request, Response, NextFunction } from 'express';
import type { AuthDto, LoginDto } from '../types/auth.type';

export class AuthController {
  private authService = new AuthService();
  /**
   * 회원가입 컨트롤러
   * @param req - 회원가입 요청 데이터 (AuthDto)
   * @param res - 회원가입 성공 메시지와 새로 생성된 사용자 데이터
   * @param next - 에러 핸들링을 위한 NextFunction
   */
  signup = async (req: Request<{}, {}, AuthDto>, res: Response, next: NextFunction) => {
    try {
      const newSignup = await this.authService.signup(req.body);

      res.status(201).json({ message: '회원가입 성공하였습니다.', data: newSignup });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 로그인 컨트롤러
   * @param req - 로그인 요청 데이터 (LoginDto)
   * @param res - 로그인 성공 메시지와 토큰 정보
   * @param next - 에러 핸들링을 위한 NextFunction
   */
  login = async (req: Request<{}, {}, LoginDto>, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = await this.authService.login(req.body);

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

  /**
   * 리프레시 토큰 컨트롤러
   * @param req - 요청 객체, 쿠키에서 리프레시 토큰을 추출하여 인증 정보를 갱신
   * @param res - 인증 정보 갱신 성공 메시지와 새로 발급된 토큰을 쿠키에 저장하여 응답
   * @param next - 에러 핸들링을 위한 NextFunction, 인증 정보가 없거나 유효하지 않은 경우 에러를 발생시키고 쿠키를 삭제하여 응답
   */
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new ValidationError('인증 정보가 없습니다. 다시 로그인 해주세요.');
      }

      const { newAccessToken, newRefreshToken } = await this.authService.refresh(refreshToken);

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

  /**
   * 로그아웃 컨트롤러
   * @param req - 요청 객체, 인증된 사용자 정보에서 userId를 추출하여 로그아웃 처리
   * @param res - 로그아웃 성공 메시지와 브라우저 쿠키 삭제를 통해 인증 정보 제거
   * @param next - 에러 핸들링을 위한 NextFunction, 로그아웃 처리 중 에러가 발생한 경우 에러를 전달하여 핸들링
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = BigInt(req.user!.userId);
      const nickname = req.user!.nickname;

      await this.authService.logout(userId);

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
}
