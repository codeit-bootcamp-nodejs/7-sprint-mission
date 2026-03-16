// prisma/seed.js
import { PrismaClient } from "@prisma/client"; // import로 변경 (이게 맞습니다)

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. 초기화 (모델 이름 소문자 필수!)
    await prisma.productComment.deleteMany();
    await prisma.articleComment.deleteMany();
    await prisma.product.deleteMany();
    await prisma.article.deleteMany();
  } catch (e) {
    console.log("초기화 중 오류(첫 실행이면 무시 가능):", e.message);
  }

  const product1 = await prisma.product.create({
    data: {
      last_name: "sprint Misson3",
      description: "미션 3 어려워 상수선언 프로덕트 1 은 어웨잇 프리즈마",
      price: 5959,
      tags: ["sprint", "mission", "fucking", "hard"],
    },
  });

  await prisma.productComment.create({
    data: {
      product_id: product1.id,
      content: "진짜 미션 3 너무 어려워요ㅠㅠ",
    },
  });

  const article1 = await prisma.article.create({
    data: {
      title: "아티클1 선언 프리즈마 아티클에 만들어라?",
      content: "이게 뭔지 모르겠네요",
      body: "바디 내용 필수라서 추가함",
    },
  });

  await prisma.articleComment.create({
    data: {
      article_id: article1.id,
      content: "이게 맞는듯",
    },
  });

  console.log(" 시딩 성공 ! !");
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
