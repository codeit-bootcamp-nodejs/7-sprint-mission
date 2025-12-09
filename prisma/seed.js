import { prisma } from "./prisma.js";

async function seedData() {
  // product 생성
  const product = await prisma.product.create({
    data: {
      name: "과자",
      description: "과자과자",
      price: 1500,
      tags: ["과자", "맛있음", "짱"],
    },
  });
  console.log("Created product : ", product);

  // article 생성
  const article = await prisma.article.create({
    data: {
      title: "우아아",
      content: "아아아아",
    },
  });
  console.log("Created article : ", article);
}

// 에러처리
seedData()
  // 에러인 경우 catch 실행
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  // 에러든 아니든 프로세스 종료를 위해 finally 실행
  .finally(async () => {
    await prisma.$disconnect();
  });
