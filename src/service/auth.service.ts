import bcrypt from 'bcrypt';
import User from '../model/user.model';
import type { AuthDto, LoginDto } from '../types/auth.type';
import { ValidationError } from '../errors/validationError';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from '../errors/forbiddenError';
import { NotFoundError } from '../errors/notFoundError';
import type { AuthPayload } from '../types/auth.type';
import { AuthRepository } from '../repository/auth.repository';

export class AuthService {
  private authRepository = new AuthRepository();
  /**
   * 회원가입 서비스
   * @param data - 회원가입 요청 데이터 (AuthDto)
   * @returns - 새로 생성된 사용자 정보 (User)
   */
  signup = async (data: AuthDto) => {
    const { email, nickname, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const entity = await this.authRepository.signup(email, nickname, hashedPassword);

    return User.fromEntity(entity);
  };

  /**
   * 로그인 서비스
   * @param data - 로그인 요청 데이터 (LoginDto)
   * @returns - 액세스 토큰과 리프레시 토큰
   */
  login = async (data: LoginDto) => {
    const { email, password } = data;

    const findUser = await this.authRepository.findUserRepo(email);
    if (!findUser) throw new ValidationError('이메일 또는 비밀번호가 올바르지 않습니다.');
    const userId = findUser.id;

    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (!passwordMatch) {
      throw new ValidationError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const accessToken = jwt.sign(
      {
        userId: findUser.id.toString(),
        nickname: findUser.nickname,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' },
    );
    const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET!, { expiresIn: '14d' });

    await this.authRepository.saveRefreshToken(refreshToken, userId);

    return { accessToken, refreshToken };
  };

  /**
   * 리프레시토큰 서비스
   * @param refreshToken - 클라이언트로부터 전달받은 리프레시 토큰
   * @returns - 새로운 액세스 토큰과 리프레시 토큰
   */
  refresh = async (refreshToken: string) => {
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch {
      throw new ValidationError('유효하지 않은 리프레시 토큰입니다.');
    }

    const stored = await this.authRepository.findRefreshTokenWithUser(refreshToken);

    if (!stored) throw new ForbiddenError('유효하지 않은 토큰입니다.');
    if (stored.expiresAt < new Date()) throw new ForbiddenError('만료된 토큰입니다.');
    if (!stored.user) throw new NotFoundError('유저 정보를 찾을 수 없습니다.');

    // 새로운 토큰 발급
    const payload: AuthPayload = {
      userId: stored.userId.toString(),
      nickname: stored.user.nickname,
    };

    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET!, { expiresIn: '14d' });

    // 기존 Refresh Token 삭제 후 새로 발급
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await this.authRepository.rotateRefreshToken(
      stored.id,
      stored.userId,
      newRefreshToken,
      expiresAt,
    );

    return { newAccessToken, newRefreshToken };
  };

  /**
   * 로그아웃 서비스
   * @param userId - 로그아웃 처리할 사용자 ID
   * @returns - 로그아웃 성공 여부 (boolean)
   */
  logout = async (userId: bigint) => {
    await this.authRepository.logout(userId);
    return true;
  };
}
