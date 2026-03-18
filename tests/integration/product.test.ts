import request from "supertest";
import app from "../../app";

describe("Product API", () => {
  const unique = Date.now();

  const user = {
    email: `product${unique}@test.com`,
    password: "12345678",
    nickname: `producter${unique}`,
  };

  let accessToken: string;
  let createdProductId: string;

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(user);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    accessToken = loginRes.body.accessToken;
  });

  it("상품 목록 조회 성공", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("인증 없이 상품 생성 실패", async () => {
    const res = await request(app).post("/api/products").send({
      name: "테스트 상품",
      price: 10000,
      description: "상품 설명",
      tags: ["test", "jest"],
    });

    expect(res.status).toBe(401);
  });

  it("상품 생성 성공", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "테스트 상품",
        price: 10000,
        description: "상품 설명",
        tags: ["test", "jest"],
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("테스트 상품");
    expect(res.body.price).toBe(10000);
    expect(res.body.description).toBe("상품 설명");
    expect(Array.isArray(res.body.tags)).toBe(true);

    createdProductId = res.body.id;
  });

  it("상품 상세 조회 성공", async () => {
    const res = await request(app).get(`/api/products/${createdProductId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdProductId);
    expect(res.body.name).toBe("테스트 상품");
    expect(res.body.price).toBe(10000);
  });

  it("상품 수정 성공", async () => {
    const res = await request(app)
      .patch(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "수정된 상품",
        price: 12000,
        description: "수정된 설명",
        tags: ["updated"],
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdProductId);
    expect(res.body.name).toBe("수정된 상품");
    expect(res.body.price).toBe(12000);
    expect(res.body.description).toBe("수정된 설명");
    expect(res.body.tags).toEqual(["updated"]);
  });

  it("상품 삭제 성공", async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);
  });

  it("삭제된 상품 상세 조회 시 404", async () => {
    const res = await request(app).get(`/api/products/${createdProductId}`);

    expect(res.status).toBe(404);
  });
});