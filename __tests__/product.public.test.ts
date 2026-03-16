import request from 'supertest';
import server from '../index';

describe('상품 API (인증 필요 없음)', () => {
  afterAll((done) => {
    server.close(done);
  });
  it('상품 목록조회', async () => {
    const res = await request(server).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
