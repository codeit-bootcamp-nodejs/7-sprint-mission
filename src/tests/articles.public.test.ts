import request from "supertest";
import app from "../app";

describe("게시글 API 테스트", () => {

  let cookie: string;

  beforeEach(async () => {
    const email = `article${Date.now()}@test.com`;
    const password = "123456";

    const registerRes = await request(app)
      .post("/auth/register")
      .send({ 
        email, 
        nickname: "tester", 
        password,
        image: "default-profile.jpg" 
      });
    
    if (registerRes.status !== 201) {
      throw new Error("Register failed");
    }

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });

    if (loginRes.status !== 200) {
      throw new Error("Login failed");
    }

    cookie = loginRes.headers["set-cookie"][0].split(";")[0];
  });

  test("게시글 생성 성공", async () => {
    const res = await request(app)
      .post("/articles")
      .set("Cookie", cookie)
      .send({
        title: "테스트 제목",
        content: "테스트 내용",
        image: "test.jpg" // 필수라고 했으니 이것만 남기고 다 제거
      });

    console.log("게시글 생성 응답:", res.status, res.body);
    expect(res.status).toBe(201);
  });

  test("게시글 상세 조회 성공", async () => {
    // 1. 게시글 생성
    const article = await request(app)
      .post("/articles")
      .set("Cookie", cookie)
      .send({
        title: "테스트 제목",
        content: "테스트 내용",
        image: "test.jpg"
      });

    expect(article.status).toBe(201); 

    // 2. 상세 조회
    const res = await request(app)
      .get(`/articles/${article.body.id}`);

    console.log("게시글 상세 조회 응답:", res.status, res.body);
    expect(res.status).toBe(200);
    // 상세 조회 결과에 생성한 제목이 잘 들어있는지 확인
    expect(res.body.title).toBe("테스트 제목");
  });
});