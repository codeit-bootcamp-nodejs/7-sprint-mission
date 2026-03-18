import request from "supertest";
import app from "../../app";

// @ts-nocheck

describe("Like API", () => {
  const unique = Date.now();

  const owner = {
    email: `owner${unique}@test.com`,
    password: "12345678",
    nickname: `owner${unique}`,
  };

  const liker = {
    email: `liker${unique}@test.com`,
    password: "12345678",
    nickname: `liker${unique}`,
  };

  let ownerToken: string;
  let likerToken: string;
  let createdProductId: string;
  let createdArticleId: string;

  beforeAll(async () => {
    // 소유자 회원가입 / 로그인
    await request(app).post("/api/auth/register").send(owner);
    const ownerLoginRes = await request(app).post("/api/auth/login").send({
      email: owner.email,
      password: owner.password,
    });
    ownerToken = ownerLoginRes.body.accessToken;

    // 좋아요 유저 회원가입 / 로그인
    await request(app).post("/api/auth/register").send(liker);
    const likerLoginRes = await request(app).post("/api/auth/login").send({
      email: liker.email,
      password: liker.password,
    });
    likerToken = likerLoginRes.body.accessToken;

    // 상품 생성
    const productRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "좋아요 테스트 상품",
        price: 15000,
        description: "좋아요 테스트용 상품",
        tags: ["like"],
      });

    createdProductId = productRes.body.id;

    // 게시글 생성
    const articleRes = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        title: "좋아요 테스트 게시글",
        content: "좋아요 테스트용 게시글 내용",
      });

    createdArticleId = articleRes.body.id;
  });

  // 인증 없이 상품 좋아요 실패
  it("인증 없이 상품 좋아요 실패", async () => {
    const res = await request(app).post(`/api/products/${createdProductId}/like`);

    expect(res.status).toBe(401);
  });

  // 상품 좋아요 성공
  it("상품 좋아요 성공", async () => {
    const res = await request(app)
      .post(`/api/products/${createdProductId}/like`)
      .set("Authorization", `Bearer ${likerToken}`);

    expect([200, 201, 204]).toContain(res.status);
  });

  // 상품 좋아요 취소 성공
  it("상품 좋아요 취소 성공", async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}/like`)
      .set("Authorization", `Bearer ${likerToken}`);

    expect([200, 204]).toContain(res.status);
  });

  // 게시글 좋아요 성공
  it("게시글 좋아요 성공", async () => {
    const res = await request(app)
      .post(`/api/articles/${createdArticleId}/like`)
      .set("Authorization", `Bearer ${likerToken}`);

    expect([200, 201, 204]).toContain(res.status);
  });

  // 게시글 좋아요 취소 성공
  it("게시글 좋아요 취소 성공", async () => {
    const res = await request(app)
      .delete(`/api/articles/${createdArticleId}/like`)
      .set("Authorization", `Bearer ${likerToken}`);

    expect([200, 204]).toContain(res.status);
  });
});