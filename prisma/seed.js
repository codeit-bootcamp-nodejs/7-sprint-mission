import { prisma } from "./prisma.js";

async function main() {
  // 1. 상품 생성 (ID: 1)
  const product1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "테스트 상품 1",
      description: "페이지네이션 테스트를 위한 상품입니다.",
      price: 50000,
      tags: ["test", "pagination"],
    },
  });

  // 2. 게시글 생성 (ID: 1)
  const article1 = await prisma.article.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "테스트 게시글 1",
      content: "페이지네이션 테스트를 위한 게시글입니다.",
    },
  });

  console.log("Base data created:", { product1, article1 });

  // 3. 상품 댓글 35개 생성
  console.log("Seeding product comments...");
  const productCommentsData = [];
  for (let i = 1; i <= 35; i++) {
    productCommentsData.push({
      content: `상품 댓글 ${i} - 페이지네이션 테스트`,
      productId: product1.id,
      // 시간 순서 테스트를 위해 조금씩 시간 차이를 둠 (최신순 정렬 테스트용)
      created_at: new Date(Date.now() + i * 1000),
    });
  }
  // 기존 댓글 삭제 후 재생성 (중복 방지)
  await prisma.comment.deleteMany({ where: { productId: product1.id } });
  await prisma.comment.createMany({ data: productCommentsData });

  // 4. 게시글 댓글 35개 생성
  console.log("Seeding article comments...");
  const articleCommentsData = [];
  for (let i = 1; i <= 35; i++) {
    articleCommentsData.push({
      content: `게시글 댓글 ${i} - 페이지네이션 테스트`,
      articleId: article1.id,
      created_at: new Date(Date.now() + i * 1000),
    });
  }
  // 기존 댓글 삭제 후 재생성
  await prisma.comment.deleteMany({ where: { articleId: article1.id } });
  await prisma.comment.createMany({ data: articleCommentsData });

  console.log("Seeding completed.");
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
