import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding start...");

  await prisma.product.createMany({
    data: [
      {
        name: "샘플 상품 1",
        description: "샘플 설명 1",
        price: 1000,
        tags: ["sample", "test"],
      },
      {
        name: "샘플 상품 2",
        description: "샘플 설명 2",
        price: 2000,
        tags: ["demo"],
      },
    ],
  });

  await prisma.article.createMany({
    data: [
      { title: "첫 번째 게시글", content: "내용1" },
      { title: "두 번째 게시글", content: "내용2" },
    ],
  });

  console.log("🌱 Seeding complete!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
