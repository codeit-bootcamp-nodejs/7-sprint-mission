import { prisma } from "./prisma.js";

async function main() {
  console.log("Seeding 시작...");

  // 1. 기존 데이터 삭제 (초기화)
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  console.log("기존 product 및 article 데이터 삭제 완료.");

  // 2. 더미 데이터 생성 - Article
  const article1 = await prisma.article.create({
    data: {
      title: "Prisma로 CRUD 구현하기",
      content:
        "서비스 계층, 컨트롤러 계층 분리하여 깔끔하게 코드를 작성해보세요.",
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "배열 타입 필드 사용법",
      content: "PostgreSQL에서 String[] 타입을 활용하는 방법을 알아봅시다.",
    },
  });

  // 3. 더미 데이터 생성 - Product
  const product1 = await prisma.product.create({
    data: {
      name: "프리미엄 기계식 키보드",
      description: "개발 생산성을 극대화해주는 최고의 키보드입니다.",
      price: 189000,
      tags: ["재고있음", "인기상품", "할인중"],
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "초경량 무선 마우스",
      price: 45000,
      tags: ["신제품", "사무용"],
    },
  });

  console.log("✅ Article 더미 데이터:", article1.id, article2.id);
  console.log("✅ Product 더미 데이터:", product1.id, product2.id);

  console.log("🎉 Seeding 완료.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding 중 오류 발생:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
