import { prisma } from "./prisma.js";

async function main() {
  const newProduct = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "세번째 등록 상품",
      description: "범진 - 인사",
      price: 10000,
      tags: ["second"],
    },
  });
  const newArticle = await prisma.article.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "세 번째 아티클",
      content: "돌아서는 너를 보며 난 아무 말도 할 수 없었고",
    },
  });
  console.log({ newProduct, newArticle });
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
