import { AuthService } from '../service/auth.service';
import { AuthRepository } from '../repository/auth.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../errors/validationError';
import { User as PrismaUser } from '@prisma/client';
import User from '../model/user.model';

// 외부 모듈 모킹
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../repository/auth.repository');

describe('AuthService Unit Test', () => {
  let authService: AuthService;
  let mockRepo: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    const tempMockRepo = {
      signup: jest.fn(),
      findUserRepo: jest.fn(),
      saveRefreshToken: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    mockRepo = tempMockRepo;

    (AuthRepository as jest.Mock).mockImplementation(() => mockRepo);

    authService = new AuthService();

    // 환경변수 설정
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
  });

  describe('signup', () => {
    const signupDto = { email: 'new@test.com', nickname: '뉴비', password: 'password123' };
    const mockEntity: PrismaUser = {
      id: BigInt(1),
      email: 'new@test.com',
      nickname: '뉴비',
      password: 'hashed_password',
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('회원가입 성공 시 비밀번호를 해싱하여 저장하고 User 모델을 반환해야 한다', async () => {
      // bcrypt.hash 모킹
      jest.mocked(bcrypt.hash).mockImplementation(() => Promise.resolve('hashed_password'));
      mockRepo.signup.mockResolvedValue(mockEntity);

      const result = await authService.signup(signupDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 10);
      expect(mockRepo.signup).toHaveBeenCalledWith(
        signupDto.email,
        signupDto.nickname,
        'hashed_password',
      );
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe(signupDto.email);
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@test.com', password: 'password123' };
    const mockDbUser: PrismaUser = {
      id: BigInt(1),
      email: 'test@test.com',
      nickname: '테스터',
      password: 'hashed_password',
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('이메일이 존재하지 않으면 ValidationError를 던져야 한다', async () => {
      mockRepo.findUserRepo.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(ValidationError);
      expect(mockRepo.findUserRepo).toHaveBeenCalledWith(loginDto.email);
    });

    it('비밀번호가 일치하지 않으면 ValidationError를 던져야 한다', async () => {
      mockRepo.findUserRepo.mockResolvedValue(mockDbUser);
      // jest.mocked를 사용해 타입 추론 적용
      jest.mocked(bcrypt.compare).mockImplementation(() => Promise.resolve(false));

      await expect(authService.login(loginDto)).rejects.toThrow(ValidationError);
    });

    it('로그인 성공 시 토큰을 생성하고 리프레시 토큰을 저장해야 한다', async () => {
      mockRepo.findUserRepo.mockResolvedValue(mockDbUser);
      jest.mocked(bcrypt.compare).mockImplementation(() => Promise.resolve(true));

      jest.mocked(jwt.sign).mockImplementation(() => 'mocked_token');

      const result = await authService.login(loginDto);

      expect(result).toEqual({ accessToken: 'mocked_token', refreshToken: 'mocked_token' });
      expect(mockRepo.saveRefreshToken).toHaveBeenCalledWith('mocked_token', mockDbUser.id);
    });
  });

  describe('logout', () => {
    it('Repository의 logout 함수를 호출하고 true를 반환해야 한다', async () => {
      const userId = BigInt(1);

      mockRepo.logout.mockResolvedValue(undefined as unknown as void);

      const result = await authService.logout(userId);

      expect(result).toBe(true);
      expect(mockRepo.logout).toHaveBeenCalledWith(userId);
    });
  });
});
