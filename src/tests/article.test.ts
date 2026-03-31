import request from 'supertest';
import app from '../app';
import prisma from '../../prisma/prisma';

describe('로그인 상태 - 게시글 통합 API 테스트', () => {
  // 로그인 후 인증용 쿠키 보관
  let authCookie: string[];

  // 게시물 생성 후 생성된 게시물 아이디 저장
  let createdArticleId: string;

  const randomId = Math.floor(Math.random() * 1000000);
  // 생성 날짜, 시간 기준으로 새로운 회원 생성
  const testUser = {
    email: `test_${randomId}@example.com`,
    password: 'password123!',
    nickname: `유저_${randomId}`,
  };

  beforeAll(async () => {
    await prisma.refreshToken.deleteMany({});

    await request(app).post('/auth/signup').send(testUser);

    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    authCookie = loginRes.get('Set-Cookie') as unknown as string[];
  });

  test('POST /article: 게시물을 성공적으로 등록해야 한다.', async () => {
    const articleData = {
      title: '통합테스트',
      content: '통합 테스트 내용입니다.',
    };

    const response = await request(app)
      .post('/article')
      .set('Cookie', authCookie)
      .send(articleData);

    createdArticleId = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe(articleData.title);
  });

  // 로그인한 쿠키를 전달하지 않고 인증 정보가 없을때 조회 실행
  test('GET /article: 게시글 목록을 성공적으로 조회해야 한다.', async () => {
    const response = await request(app).get('/article');

    if (response.body.data.length > 0) {
    }

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta).toBeDefined();
  });

  // 로그인한 쿠키를 전달하지 않고 인증 정보가 없을때 조회 실행
  test('GET /article/:articleId: 게시글 상세 내용을 성공적으로 조회해야 한다.', async () => {
    const response = await request(app).get(`/article/${createdArticleId}`);

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(response.body.data.article.article.id).toBe(createdArticleId.toString());
  });

  test('PATCH /article/:articleId: 등록한 게시물을 성공적으로 수정해야 한다.', async () => {
    const updateData = {
      title: '수정된 통합테스트 제목',
      content: '수정된 통합테스트 내용',
    };

    const response = await request(app)
      .patch(`/article/${createdArticleId}`)
      .set('Cookie', authCookie)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe(updateData.title);
  });

  test('DELETE /article/:articleId: 등록한 게시물을 성공적으로 삭제해야 한다.', async () => {
    const response = await request(app)
      .delete(`/article/${createdArticleId}`)
      .set('Cookie', authCookie);

    expect(response.status).toBe(204);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
