import request from "supertest";
import app from "../app";
import { prismaClient } from "../lib/prismaClient";

describe("게시글(Articles) API 통합 테스트", () => {
  let writerCookie: string;    // 작성자 쿠키
  let strangerCookie: string;  // 다른 사용자 쿠키
  let articleId: number;

  // 테스트 시작 전 사용자 2명 생성 및 로그인
  beforeAll(async () => {
    // 1. 작성자 계정 생성 및 로그인
    const user1 = { email: `writer${Date.now()}@test.com`, password: "password123", nickname: "writer" };
    await request(app).post("/auth/register").send({ ...user1, image: "default.jpg" });
    const login1 = await request(app).post("/auth/login").send({ email: user1.email, password: user1.password });
    writerCookie = login1.headers["set-cookie"][0].split(";")[0];

    // 2. 다른 사용자(타인) 계정 생성 및 로그인
    const user2 = { email: `stranger${Date.now()}@test.com`, password: "password123", nickname: "stranger" };
    await request(app).post("/auth/register").send({ ...user2, image: "default.jpg" });
    const login2 = await request(app).post("/auth/login").send({ email: user2.email, password: user2.password });
    strangerCookie = login2.headers["set-cookie"][0].split(";")[0];
  });

  // --- [1. 인증이 필요하지 않은 API 테스트] ---
  describe("비인증 API 테스트 (GET)", () => {
    test("GET /articles - 전체 목록 조회 성공 (로그인 불필요)", async () => {
      const res = await request(app).get("/articles");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("GET /articles/:id - 단일 조회 실패 (존재하지 않는 ID)", async () => {
      const res = await request(app).get("/articles/999999");
      expect(res.status).toBe(404);
    });
  });

  // --- [2. 인증이 필요한 API 테스트 - 생성/수정/삭제] ---
  describe("인증 필수 API 테스트 (CUD)", () => {
    
    test("POST /articles - 게시글 생성 성공 (로그인 상태)", async () => {
      const res = await request(app)
        .post("/articles")
        .set("Cookie", writerCookie)
        .send({
          title: "테스트 제목",
          content: "테스트 내용",
          image: "test.jpg"
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      articleId = res.body.id; // 이후 테스트를 위해 ID 저장
    });

    test("POST /articles - 게시글 생성 실패 (로그인 안 함)", async () => {
      const res = await request(app)
        .post("/articles")
        .send({ title: "실패해야 함", content: "내용" });
      
      expect(res.status).toBe(401);
    });

    test("GET /articles/:id - 생성된 게시글 단일 조회 성공", async () => {
      const res = await request(app).get(`/articles/${articleId}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("테스트 제목");
    });

    test("PATCH /articles/:id - 게시글 수정 실패 (작성자가 아닌 경우)", async () => {
      const res = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Cookie", strangerCookie) // 다른 사람 쿠키 사용
        .send({ title: "남의 글 수정 시도" });
      
      // 서버 로직에 따라 403(Forbidden)이 정석입니다.
      expect(res.status).toBe(403); 
    });

    test("PATCH /articles/:id - 게시글 수정 성공 (본인)", async () => {
      const res = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Cookie", writerCookie)
        .send({ title: "수정된 제목" });
      
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("수정된 제목");
    });

    test("DELETE /articles/:id - 게시글 삭제 실패 (작성자가 아닌 경우)", async () => {
      const res = await request(app)
        .delete(`/articles/${articleId}`)
        .set("Cookie", strangerCookie);
      
      expect(res.status).toBe(403);
    });

    test("DELETE /articles/:id - 게시글 삭제 성공 (본인)", async () => {
      const res = await request(app)
        .delete(`/articles/${articleId}`)
        .set("Cookie", writerCookie);
      
      // 보통 삭제 성공 시 204(No Content) 또는 200을 반환합니다.
      expect([200, 204]).toContain(res.status);
    });

    test("DELETE /articles/:id - 게시글 삭제 실패 (이미 삭제됨)", async () => {
      const res = await request(app)
        .delete(`/articles/${articleId}`)
        .set("Cookie", writerCookie);
      
      expect(res.status).toBe(404);
    });
  });

  // --- [3. 댓글 API 테스트] ---
  describe("댓글 API 테스트", () => {
    test("POST /articles/:id/comments - 댓글 작성 성공", async () => {
      // 삭제되지 않은 새로운 게시글을 하나 더 만들거나 기존 로직 활용
      // 여기서는 예시로 생략하지만 위와 같은 흐름으로 작성하면 됩니다.
    });
  });
});