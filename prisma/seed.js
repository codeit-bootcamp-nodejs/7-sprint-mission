import { prisma } from "./prisma.js";

async function main() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  const productData = [
    {
      name: "Node.js 일주일만에 완전 정복",
      description: "예, 일주일만에 완전 정복하고 싶습니다. 흑흑.",
      price: 1500000,
      tags: ["도서", "학습", "코딩", "백엔드"],
    },
    {
      name: "루비로 배우는 객체지향 디자인",
      description: "이거 읽고 사람됩니다. by 주강사님",
      price: 20700,
      tags: ["도서", "OOP", "코딩", "백엔드"],
    },
    {
      name: "Macbook Air M1",
      description: "맥북은 캡스락이 한영키다..!",
      price: 1300000,
      tags: ["노트북", "전자제품"],
    },
  ];

  const productResults = await prisma.product.createMany({
    data: productData,
  });

  const articleData = [
    {
      title: "인생이란 무엇일까요",
      content: "인생은 B와 D 사이의 C. Birth와 Death사이의... Chicken.",
    },
    {
      title: "속보",
      content:
        "내 코딩실력보다 내가 제미나이 거짓말 잡아내는 실력이 더 빠르게 올라 충격...",
    },
    {
      title: "코딩은 나의 로또",
      content: "맞는 게 하나도 없어..",
    },
  ];
  const articleResults = await prisma.article.createMany({
    data: articleData,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
