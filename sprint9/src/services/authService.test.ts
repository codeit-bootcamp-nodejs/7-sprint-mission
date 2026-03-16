import { prismaClient } from '../lib/prismaClient';
import * as authService from './authService';

describe('Auth Service', () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('register', () => {
    beforeAll(async () => {
      // 테스트에서 생성된 사용자 삭제
      await prismaClient.user.deleteMany({
        where: {
          email: 'testuser1@example.com',
        },
      });
    });

    test('POST /auth/register', async () => {
      const userData = {
        nickname: 'testuser',
        email: 'testuser1@example.com',
        password: 'password123',
        image: null,
      };
      const registeredUser = await authService.register(userData);
      expect(registeredUser).toHaveProperty('id');
      expect(registeredUser).toHaveProperty('nickname', userData.nickname);
      expect(registeredUser).toHaveProperty('email', userData.email);
    });
  });

  describe('login', () => {
    beforeAll(async () => {
      await prismaClient.user.deleteMany({
        where: {
          email: 'testuser2@example.com',
        },
      });

      const userData = {
        nickname: 'testuser',
        email: 'testuser2@example.com',
        password: 'password123',
        image: null,
      };
      await authService.register(userData);
    });

    test('POST /auth/login', async () => {
      const credentials = {
        email: 'testuser2@example.com',
        password: 'password123',
      };
      const loggedInUser = await authService.login(credentials.email, credentials.password);
      expect(loggedInUser).toHaveProperty('id');
      expect(loggedInUser).toHaveProperty('nickname', 'testuser');
      expect(loggedInUser).toHaveProperty('email', credentials.email);
    });
  });
});
