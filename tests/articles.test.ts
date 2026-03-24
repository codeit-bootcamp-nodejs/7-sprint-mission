import request from 'supertest';
import app from '../src/main.js';
import { prismaClient } from '../src/lib/prismaClient.js';

describe('게시글 및 댓글 통합 테스트', () => {
  let writerCookie: string[] = [];
  let readerCookie: string[] = [];
  let articleId: number;

  beforeAll(async () => {
    await prismaClient.comment.deleteMany().catch(() => {});
    await prismaClient.like.deleteMany().catch(() => {});
    await prismaClient.article.deleteMany().catch(() => {});
    await prismaClient.user.deleteMany().catch(() => {});

    // 두 명의 유저 세팅
    await request(app)
      .post('/auth/register')
      .send({ email: 'w@a.com', nickname: '작가', password: 'password123' });
    const loginW = await request(app)
      .post('/auth/login')
      .send({ email: 'w@a.com', password: 'password123' });
    writerCookie = (loginW.get('Set-Cookie') as string[]) || [];

    await request(app)
      .post('/auth/register')
      .send({ email: 'r@a.com', nickname: '독자', password: 'password123' });
    const loginR = await request(app)
      .post('/auth/login')
      .send({ email: 'r@a.com', password: 'password123' });
    readerCookie = (loginR.get('Set-Cookie') as string[]) || [];
  });

  describe('게시글 관리', () => {
    it('게시글을 생성한다 (201)', async () => {
      const res = await request(app)
        .post('/articles')
        .set('Cookie', writerCookie)
        .send({ title: '제목', content: '내용', image: null });
      articleId = res.body.id;
      expect(res.statusCode).toBe(201);
    });

    it('상세 조회 시 로그인 여부에 따라 isLiked가 변한다 (optionalAuth)', async () => {
      // 1. 좋아요 누르기 전 (false)
      const res1 = await request(app).get(`/articles/${articleId}`).set('Cookie', readerCookie);
      expect(res1.body.isLiked).toBe(false);

      // 2. 좋아요 누른 후 (true)
      await request(app).post(`/articles/${articleId}/like`).set('Cookie', readerCookie);
      const res2 = await request(app).get(`/articles/${articleId}`).set('Cookie', readerCookie);
      expect(res2.body.isLiked).toBe(true);
    });

    it('타인의 게시글을 수정하려고 하면 403 Forbidden을 반환한다 (인가)', async () => {
      const res = await request(app)
        .patch(`/articles/${articleId}`)
        .set('Cookie', readerCookie)
        .send({ title: '수정' });
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('게시글 수정 권한이 없습니다.');
    });
  });

  describe('댓글 관리 (커서 페이지네이션)', () => {
    it('게시글에 댓글을 생성한다 (201)', async () => {
      const res = await request(app)
        .post(`/articles/${articleId}/comments`)
        .set('Cookie', readerCookie)
        .send({ content: '댓글' });
      expect(res.statusCode).toBe(201);
    });

    it('댓글 목록 조회 시 nextCursor를 포함한다', async () => {
      const res = await request(app).get(`/articles/${articleId}/comments`).query({ limit: 5 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('nextCursor');
    });
  });
});
