import request from 'supertest';
import app from '../app';
import prisma from '../../prisma/prisma';

describe('인증(Auth) API 통합 테스트', () => {
  const randomId = Math.floor(Math.random() * 1000000);
  const testUser = {
    email: `test_${randomId}@example.com`,
    password: 'password123!',
    nickname: `유저_${randomId}`,
  };

  let authCookies!: string[];

  beforeAll(async () => {
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        OR: [{ email: testUser.email }, { nickname: testUser.nickname }],
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST /auth/signup - 회원가입 성공 시 상태 코드 201을 반환해야 한다.', async () => {
    const response = await request(app).post('/auth/signup').send(testUser);
    expect(response.status).toBe(201);
  });

  test('POST /auth/login - 로그인 성공시 상태 코드 200과 쿠키를 반환해야 한다.', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(200);
    authCookies = response.headers['set-cookie'] as unknown as string[];

    const hasAccessToken = authCookies.some((cookie) => cookie.includes('accessToken'));
    const hasRefreshToken = authCookies.some((cookie) => cookie.includes('refreshToken'));

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(hasAccessToken).toBe(true);
    expect(hasRefreshToken).toBe(true);
  });

  test('POST /auth/logout - 로그아웃 성공시 쿠키가 삭제되어야 한다.', async () => {
    const response = await request(app).post('/auth/logout').set('Cookie', authCookies);

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
