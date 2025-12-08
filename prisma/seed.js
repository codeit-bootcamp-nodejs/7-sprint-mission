// prisma/seed.js
import { prisma } from "./prisma.js";

async function main() {
   // 기존 데이터 삭제 (초기화)
   console.log("Delete previous data");
   // 테이블 변경할거면 변경
   await prisma.product.deleteMany();

   // 더미 데이터 생성
   console.log("Seed dummies");
   const payload = await prisma.product.createMany({
      data: [
         {
            name: "title1",
            description: "content1",
            price: 100,
         },
         {
            name: "title2",
            description: "content2",
            price: 100,
         },
         {
            name: "title3",
            description: "content3",
            price: 100,
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

//export default prisma;
// npx prisma db seed
