import request from 'supertest';
import server from '../index';

describe('게시글 API (인증 필요 없음)', () => {
  afterAll((done) => {
    server.close(done);
  });
  it('게시글 목록 조회', async () => {
    const res = await request(server).get('/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
