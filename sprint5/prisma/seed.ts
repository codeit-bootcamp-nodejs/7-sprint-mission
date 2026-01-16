import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
//npx prisma db seed

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  console.log('Clean database');
  await prisma.like.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 비밀번호 암호화, user 별로 암호 동일
  const hashedPassword = await bcrypt.hash('test1234', 10);

  // 유저 생성
  console.log('Seeding users...');
  const user1 = await prisma.user.create({
    data: {
      email: 'ABC@example.com',
      nickname: 'ABC',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'DEF@example.com',
      nickname: 'DEF',
      password: hashedPassword,
    },
  });

  // 게시글 생성
  console.log('Seeding articles...');
  const article1 = await prisma.article.create({
    data: {
      title: '첫 번째 게시글',
      content: 'HI',
      userId: user1.id,
    },
  });

  // 상품 생성
  console.log('Seeding products...');
  const product1 = await prisma.product.create({
    data: {
      name: 'product1',
      description: 'nice',
      price: 150000,
      tags: ['IT', '장비', 'product'],
      images: ['https://example.com/keyboard.jpg'],
      userId: user2.id,
    },
  });

  // 댓글 생성
  console.log('Seeding comments...');
  await prisma.comment.create({
    data: {
      content: 'hello',
      articleId: article1.id,
      userId: user2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'good',
      productId: product1.id,
      userId: user1.id,
    },
  });

  // 좋아요 및 찜하기
  console.log('Seeding likes and favorites...');
  await prisma.like.create({
    data: {
      articleId: article1.id,
      userId: user2.id,
    },
  });

  await prisma.favorite.create({
    data: {
      productId: product1.id,
      userId: user1.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
