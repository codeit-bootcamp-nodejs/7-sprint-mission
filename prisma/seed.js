import { prisma } from "./prisma.js";
import { articleMockData } from "./mocks/articleMock.js";
import { productMockData } from "./mocks/productMock.js";

const main = async () => {
  //   await prisma.article.deleteMany();
  //   await prisma.product.deleteMany();
  //   await prisma.article.createMany({
  //     data: articleMockData,
  //   });
  //   await prisma.product.createMany({
  //     data: productMockData,
  //   });
  //   console.log("성공");
};

main()
  .catch(async (err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
