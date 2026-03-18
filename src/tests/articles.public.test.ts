import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

describe('Articles API (인증 불필요)', () => {
  let testUserId: number;
  let testArticleId: number;

  beforeAll(async () => {
    const user = await prismaClient.user.create({
      data: {
        email: 'article-public-test@example.com',
        nickname: 'articletester',
        password: 'hashed-password',
      },
    });
    testUserId = user.id;

    const article = await prismaClient.article.create({
      data: {
        title: '테스트 게시글 제목',
        content: '테스트 게시글 본문입니다.',
        userId: testUserId,
      },
    });
    testArticleId = article.id;

    await prismaClient.comment.create({
      data: {
        content: '테스트 게시글 댓글',
        articleId: testArticleId,
        userId: testUserId,
      },
    });
  });

  afterAll(async () => {
    await prismaClient.comment.deleteMany({ where: { articleId: testArticleId } });
    await prismaClient.article.delete({ where: { id: testArticleId } });
    await prismaClient.user.delete({ where: { id: testUserId } });
    await prismaClient.$disconnect();
  });

  describe('GET /articles', () => {
    it('게시글 목록을 정상적으로 반환한다', async () => {
      const res = await request(app).get('/articles');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(res.body).toHaveProperty('totalCount');
      expect(Array.isArray(res.body.list)).toBe(true);
    });

    it('page, pageSize 쿼리 파라미터가 적용된다', async () => {
      const res = await request(app).get('/articles?page=1&pageSize=1');
      expect(res.status).toBe(200);
      expect(res.body.list.length).toBeLessThanOrEqual(1);
    });

    it('keyword 검색이 동작한다', async () => {
      const res = await request(app).get('/articles?keyword=테스트 게시글');
      expect(res.status).toBe(200);
      expect(res.body.list.length).toBeGreaterThanOrEqual(1);
      expect(res.body.list[0].title).toContain('테스트 게시글');
    });

    it('존재하지 않는 keyword는 빈 목록을 반환한다', async () => {
      const res = await request(app).get('/articles?keyword=절대없는게시글xyz123');
      expect(res.status).toBe(200);
      expect(res.body.list).toHaveLength(0);
    });

    it('각 게시글에 likeCount 필드가 포함된다', async () => {
      const res = await request(app).get('/articles');
      expect(res.status).toBe(200);
      res.body.list.forEach((article: any) => {
        expect(article).toHaveProperty('likeCount');
      });
    });

    it('orderBy=recent 정렬이 동작한다', async () => {
      const res = await request(app).get('/articles?orderBy=recent');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
    });
  });

  describe('GET /articles/:id', () => {
    it('존재하는 게시글을 정상적으로 반환한다', async () => {
      const res = await request(app).get(`/articles/${testArticleId}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: testArticleId,
        title: '테스트 게시글 제목',
        content: '테스트 게시글 본문입니다.',
      });
    });

    it('게시글에 likeCount 필드가 포함된다', async () => {
      const res = await request(app).get(`/articles/${testArticleId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('likeCount');
      expect(res.body.likeCount).toBe(0);
    });

    it('존재하지 않는 게시글 ID는 404를 반환한다', async () => {
      const res = await request(app).get('/articles/9999999');
      expect(res.status).toBe(404);
    });

    it('유효하지 않은 ID 형식은 400을 반환한다', async () => {
      const res = await request(app).get('/articles/not-a-number');
      expect(res.status).toBe(400);
    });
  });

  describe('GET /articles/:id/comments', () => {
    it('게시글의 댓글 목록을 정상적으로 반환한다', async () => {
      const res = await request(app).get(`/articles/${testArticleId}/comments`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(Array.isArray(res.body.list)).toBe(true);
      expect(res.body.list.length).toBeGreaterThanOrEqual(1);
    });

    it('댓글에 content 필드가 포함된다', async () => {
      const res = await request(app).get(`/articles/${testArticleId}/comments`);
      expect(res.status).toBe(200);
      expect(res.body.list[0]).toHaveProperty('content', '테스트 게시글 댓글');
    });

    it('존재하지 않는 게시글의 댓글 목록은 빈 배열을 반환한다', async () => {
      const res = await request(app).get('/articles/9999999/comments');
      expect(res.status).toBe(404);
    });
  });
});
