// prisma/seed.js

import { homedir } from "os";
import { prisma } from "./prisma.js";

async function main() {
  // 기존 데이터 삭제 (초기화)
  console.log("Delete previous data");
  await prisma.Product.deleteMany();
  // 더미데이터 생성
  console.log("Seed dummies");
  const createManyResult = await prisma.Product.createMany({
    data: [
      {
        name: "mac air",
        descripcion: "애플에서 나온 노트북입니다",
        price: 1600000,
        tags: ["애플", "전자제품", "신상품", "노트북"],
      },
      {
        name: "에플 무선 마우스",
        descripcion: "무선으로 편하게 사용할 수 있는 상품입니다",
        price: 50000,
        tags: ["애플", "전자제품", "마우스"],
      },
    ],
  });

  const creatArticleResult = await prisma.Article.createMany({
    data: [
      {
        title: "노트북 단축키",
        content: "노트북 사용시 유용한 단축키 모음입니다.",
        tags: ["단축키", "전자제품", "노트북"],
      },
      {
        title: "무선마우스 연결",
        content: "무선마우스 블루트스 연결 방법에 관한 내용입니다.",
        tags: ["전자제품", "마우스", "연결 방법"],
      },
    ],
  });
  console.log(createManyResult.count, "dummies seeded");
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
