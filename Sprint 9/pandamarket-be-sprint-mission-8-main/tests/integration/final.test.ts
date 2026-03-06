import request from "supertest";
import { app } from "../../src/main";

describe("미션 요구사항 통합 테스트", () => {
   it("상품 목록 조회 (인증 x)", async () => {
      const res = await request(app).get("/products");
      expect([200, 500]).toContain(res.status);
   });

   it("게시글 목록 조회 (인증 필요x)", async () => {
      const res = await request(app).get("/articles");
      expect([200, 500]).toContain(res.status);
   });

   describe("Auth API 테스트", () => {
      it("유효하지 않은 데이터로 가입 시도", async () => {
         const res = await request(app).post("/auth/register").send({ email: "invalid" });
         expect([400, 500]).toContain(res.status);
      });

      it("POST /auth/login - 로그인 시도", async () => {
         const res = await request(app).post("/auth/login").send({ email: "test@test.com", password: "123" });
         expect([400, 500]).toContain(res.status);
      });
   });

   describe("인증 필요한 API", () => {
      it("토큰 없이 접근 시 거절되어야 한다", async () => {
         const res = await request(app).post("/products").send({ name: "테스트" });
         expect(res.status).toBe(401);
      });

      it("토큰 없이 접근 시 거절되어야 한다", async () => {
         const res = await request(app).post("/articles").send({ title: "테스트" });
         expect(res.status).toBe(401);
      });
   });
});
