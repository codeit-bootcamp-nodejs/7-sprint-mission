import request from 'supertest';
import app from '../src/main.js';
import { prismaClient } from '../src/lib/prismaClient.js';

describe('Products 통합 테스트 (상품, 댓글, 찜하기)', () => {
  let ownerCookie: string[] = []; // 상품 등록자
  let buyerCookie: string[] = []; // 일반 구매자
  let productId: number;

  const ownerUser = { email: 'owner@test.com', nickname: '판매자', password: 'password123' };
  const buyerUser = { email: 'buyer@test.com', nickname: '구매자', password: 'password123' };

  beforeAll(async () => {
    // 1. DB 초기화 (자식 -> 부모 순서로 삭제)
    await prismaClient.comment.deleteMany().catch(() => {});
    await prismaClient.favorite.deleteMany().catch(() => {});
    await prismaClient.product.deleteMany().catch(() => {});
    await prismaClient.user.deleteMany().catch(() => {});

    // 2. 테스트용 유저 두 명 생성 및 쿠키 확보
    await request(app).post('/auth/register').send(ownerUser);
    const loginOwner = await request(app)
      .post('/auth/login')
      .send({ email: ownerUser.email, password: ownerUser.password });
    ownerCookie = loginOwner.get('Set-Cookie') || [];

    await request(app).post('/auth/register').send(buyerUser);
    const loginBuyer = await request(app)
      .post('/auth/login')
      .send({ email: buyerUser.email, password: buyerUser.password });
    buyerCookie = loginBuyer.get('Set-Cookie') || [];
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('상품 생성 (POST /products)', () => {
    it('로그인한 유저는 상품을 성공적으로 등록할 수 있다 (201)', async () => {
      const res = await request(app)
        .post('/products')
        .set('Cookie', ownerCookie)
        .send({
          name: '중고 맥북',
          description: '상태 아주 깨끗합니다.',
          price: 1500000,
          tags: ['전자기기', '애플'],
          images: ['macbook.png'],
        });
      //401 에러의 진짜 메시지를 확인하기 위해 추가
      if (res.statusCode === 401) {
        console.log('❌ 상품 등록 실패 메시지:', res.body.message);
      }
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('중고 맥북');
      productId = res.body.id;
    });

    it('필수 데이터(이름) 누락 시 400 에러를 반환한다 (Superstruct 유효성 검증)', async () => {
      const res = await request(app)
        .post('/products')
        .set('Cookie', ownerCookie)
        .send({ price: 1000 }); // name, description 누락

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('상품 조회 (GET /products)', () => {
    it('상품 목록을 페이징 및 검색어와 함께 조회한다 (totalCount 포함)', async () => {
      const res = await request(app)
        .get('/products')
        .query({ page: 1, pageSize: 10, orderBy: 'recent', keyword: '맥북' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(res.body).toHaveProperty('totalCount');
      expect(res.body.list[0].name).toContain('맥북');
    });

    it('상세 조회 시 로그인 여부에 따라 isLiked(찜 여부)가 포함된다', async () => {
      const res = await request(app).get(`/products/${productId}`).set('Cookie', buyerCookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('isLiked');
      expect(res.body.isLiked).toBe(false); // 아직 찜하기 전
    });
  });

  describe('상품 수정 및 삭제 (인가 테스트)', () => {
    it('상품 등록자가 아니면 상품을 수정할 수 없다 (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/products/${productId}`)
        .set('Cookie', buyerCookie) // 작성자가 아닌 쿠키 사용
        .send({ name: '해킹된 상품명' });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('상품 수정 권한이 없습니다.');
    });

    it('상품 등록자가 아니면 상품을 삭제할 수 없다 (403 Forbidden)', async () => {
      const res = await request(app).delete(`/products/${productId}`).set('Cookie', buyerCookie);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('상품 삭제 권한이 없습니다.');
    });

    it('작성자는 자신의 상품을 성공적으로 수정할 수 있다 (200)', async () => {
      const res = await request(app)
        .patch(`/products/${productId}`)
        .set('Cookie', ownerCookie)
        .send({ price: 1400000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(1400000);
    });
  });

  describe('상품 찜하기 토글 (POST /products/:id/favorite)', () => {
    it('찜하기를 처음 누르면 201과 isLiked: true를 반환한다', async () => {
      const res = await request(app)
        .post(`/products/${productId}/favorite`)
        .set('Cookie', buyerCookie);

      expect(res.statusCode).toBe(201);
      expect(res.body.isLiked).toBe(true);
    });

    it('다시 누르면 찜하기가 취소되고 200과 isLiked: false를 반환한다', async () => {
      const res = await request(app)
        .post(`/products/${productId}/favorite`)
        .set('Cookie', buyerCookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.isLiked).toBe(false);
    });
  });

  describe('상품 댓글 ', () => {
    it('상품에 댓글을 등록한다 (201)', async () => {
      const res = await request(app)
        .post(`/products/${productId}/comments`)
        .set('Cookie', buyerCookie)
        .send({ content: '이 제품 네고 가능한가요?' });

      expect(res.statusCode).toBe(201);
      expect(res.body.content).toBe('이 제품 네고 가능한가요?');
    });

    it('댓글 목록 조회 시 커서 정보를 반환한다', async () => {
      const res = await request(app).get(`/products/${productId}/comments`).query({ limit: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(res.body).toHaveProperty('nextCursor');
    });
  });
});
