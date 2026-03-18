import request from "supertest";
import app from "../../app";

describe("Article API", () => {
  const unique = Date.now();

  const user = {
    email: `article${unique}@test.com`,
    password: "12345678",
    nickname: `articleUser${unique}`,
  };

  let accessToken: string;
  let createdArticleId: string;

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(user);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    accessToken = loginRes.body.accessToken;
  });

  it("게시글 목록 조회 성공", async () => {
    const res = await request(app).get("/api/articles");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("인증 없이 게시글 생성 실패", async () => {
    const res = await request(app).post("/api/articles").send({
      title: "테스트 게시글",
      content: "게시글 내용입니다.",
    });

    expect(res.status).toBe(401);
  });

  it("게시글 생성 성공", async () => {
    const res = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "테스트 게시글",
        content: "게시글 내용입니다.",
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("테스트 게시글");
    expect(res.body.content).toBe("게시글 내용입니다.");

    createdArticleId = res.body.id;
  });

  it("게시글 상세 조회 성공", async () => {
    const res = await request(app).get(`/api/articles/${createdArticleId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdArticleId);
    expect(res.body.title).toBe("테스트 게시글");
    expect(res.body.content).toBe("게시글 내용입니다.");
  });

  it("게시글 수정 성공", async () => {
    const res = await request(app)
      .patch(`/api/articles/${createdArticleId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "수정된 게시글",
        content: "수정된 내용입니다.",
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdArticleId);
    expect(res.body.title).toBe("수정된 게시글");
    expect(res.body.content).toBe("수정된 내용입니다.");
  });

  it("게시글 삭제 성공", async () => {
    const res = await request(app)
      .delete(`/api/articles/${createdArticleId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);
  });

  it("삭제된 게시글 상세 조회 시 404", async () => {
    const res = await request(app).get(`/api/articles/${createdArticleId}`);

    expect(res.status).toBe(404);
  });
});