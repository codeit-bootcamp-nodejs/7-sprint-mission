import { prisma } from "./prisma.js";

async function main() {
  // 기존 데이터 삭제 (초기화)
  //console.log("Delete previous data");
  //await prisma.article.deleteMany();
  //await prisma.product.deleteMany();

  // 더미 데이터 생성
  console.log("Seed dummies");
  const payload = await prisma.article.createMany({
    data: [
      {
        title: "title1",
        content: "content1",
      },
      {
        title: "title2",
        content: "content2",
      },
      {
        title: "title3",
        content: "content3",
      },
    ],
  });

  const payload2 = await prisma.product.createMany({
    data: [
      {
        name: "item1",
        price: 1000,
      },
      {
        name: "item2",
        price: 2000,
      },
      {
        name: "item3",
        price: 3000,
      },
    ],
  });

  console.log(payload.count, " dummies seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
