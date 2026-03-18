import request from "supertest";
import app from "../../app";

describe("Auth API", () => {
  const unique = Date.now();

  const user = {
    email: `test${unique}@test.com`,
    password: "12345678",
    nickname: `tester${unique}`,
  };

  it("회원가입 성공", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user.nickname).toBe(user.nickname);
    expect(res.body.accessToken).toBeDefined();
  });

  it("로그인 성공", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: user.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });
});