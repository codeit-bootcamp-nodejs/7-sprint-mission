import request from "supertest";
import app from "../../app";

// @ts-nocheck

describe("Comment API", () => {
  const unique = Date.now();

  const user = {
    email: `comment${unique}@test.com`,
    password: "12345678",
    nickname: `commentUser${unique}`,
  };

  let accessToken: string;
  let createdProductId: string;
  let createdArticleId: string;
  let createdProductCommentId: string;
  let createdArticleCommentId: string;

  beforeAll(async () => {
    // 회원가입
    await request(app).post("/api/auth/register").send(user);

    // 로그인
    const loginRes = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    accessToken = loginRes.body.accessToken;

    // 상품 생성
    const productRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "댓글 테스트 상품",
        price: 10000,
        description: "댓글 테스트용 상품 설명",
        tags: ["comment"],
      });

    createdProductId = productRes.body.id;

    // 게시글 생성
    const articleRes = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "댓글 테스트 게시글",
        content: "댓글 테스트용 게시글 내용",
      });

    createdArticleId = articleRes.body.id;
  });

  // 상품 댓글 생성
  it("상품 댓글 생성 성공", async () => {
    const res = await request(app)
      .post(`/api/products/${createdProductId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "상품 댓글입니다.",
      });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("상품 댓글입니다.");

    createdProductCommentId = res.body.id;
  });

  // 상품 댓글 목록 조회
  it("상품 댓글 목록 조회 성공", async () => {
    const res = await request(app).get(
      `/api/products/${createdProductId}/comments`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  // 게시글 댓글 생성
  it("게시글 댓글 생성 성공", async () => {
    const res = await request(app)
      .post(`/api/articles/${createdArticleId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "게시글 댓글입니다.",
      });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("게시글 댓글입니다.");

    createdArticleCommentId = res.body.id;
  });

  // 게시글 댓글 목록 조회
  it("게시글 댓글 목록 조회 성공", async () => {
    const res = await request(app).get(
      `/api/articles/${createdArticleId}/comments`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  // 댓글 수정
  it("댓글 수정 성공", async () => {
    const res = await request(app)
      .patch(`/api/comments/${createdProductCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "수정된 상품 댓글입니다.",
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdProductCommentId);
    expect(res.body.content).toBe("수정된 상품 댓글입니다.");
  });

  // 댓글 삭제
  it("댓글 삭제 성공", async () => {
    const res = await request(app)
      .delete(`/api/comments/${createdArticleCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);
  });

  // 삭제된 댓글 재삭제 시 404
  it("삭제된 댓글 재삭제 시 404", async () => {
    const res = await request(app)
      .delete(`/api/comments/${createdArticleCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});