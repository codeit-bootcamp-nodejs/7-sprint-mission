import request from 'supertest';
import app from '../main';

describe('게시글 API 통합 테스트', () => {
  let authCookie: string[] | undefined;
  let testArticleId: number;

  const testUser = {
    email: 'article@test.com',
    nickname: '글작성자',
    password: 'password123',
    image: null,
  };

  const articleData = {
    title: '  테스트 게시글 제목  ',
    content: '테스트 게시글 내용입니다.',
    image: null,
  };

  //테스트 전용 유저 생성 및 로그인
  beforeAll(async () => {
    await request(app).post('/auth/register').send(testUser);
    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    authCookie = loginRes.get('Set-Cookie');
  });

  describe('인증이 필요하지 않은 API', () => {
    test('GET /articles - 초기 게시글 목록은 빈 배열이어야 한다 (200)', async () => {
      const res = await request(app).get('/articles');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(res.body.totalCount).toBe(0);
    });

    test('GET /articles/:id - 존재하지 않는 글 조회 시 404를 반환', async () => {
      const res = await request(app).get('/articles/999');
      expect(res.status).toBe(404);
    });
  });

  describe('인증이 필요한 API ', () => {
    test('POST /articles - 게시글 등록 성공시 201 반환', async () => {
      const res = await request(app)
        .post('/articles')
        .set('Cookie', authCookie as string[])
        .send(articleData);

      expect(res.status).toBe(201);
      // title이 좌우 공백 제거(trim)되어 저장되었는지 확인
      expect(res.body.title).toBe('테스트 게시글 제목');
      testArticleId = res.body.id;
    });

    test('PATCH /articles/:id - 내 게시글 수정 성공시 200 반환', async () => {
      const updateData = { content: '수정된 내용입니다.' };
      const res = await request(app)
        .patch(`/articles/${testArticleId}`)
        .set('Cookie', authCookie as string[])
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.content).toBe('수정된 내용입니다.');
    });

    test('DELETE /articles/:id - 게시글 삭제 시 204를 반환', async () => {
      const res = await request(app)
        .delete(`/articles/${testArticleId}`)
        .set('Cookie', authCookie as string[]);

      expect(res.status).toBe(204);
    });
  });

  describe('삭제 확인 테스트', () => {
    test('삭제된 게시글 조회 시 404를 반환', async () => {
      const res = await request(app).get(`/articles/${testArticleId}`);
      expect(res.status).toBe(404);
    });
  });
});
