import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      nickname: 'Alice',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      nickname: 'Bob',
      password: hashedPassword,
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: '맥북 프로 14인치',
      description: 'M3 칩 탑재 맥북 프로입니다.',
      price: 2500000,
      tags: ['전자제품', '노트북', '애플'],
      images: [],
      authorId: user1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: '아이폰 15 프로',
      description: '최신 아이폰입니다.',
      price: 1500000,
      tags: ['전자제품', '스마트폰'],
      images: [],
      authorId: user2.id,
    },
  });

  const article1 = await prisma.article.create({
    data: {
      title: '판다마켓 첫 게시글',
      content: '안녕하세요! 판다마켓입니다.',
      authorId: user1.id,
    },
  });

  await prisma.productComment.create({
    data: {
      content: '좋은 상품이네요!',
      authorId: user2.id,
      productId: product1.id,
    },
  });

  await prisma.articleComment.create({
    data: {
      content: '좋은 글이네요!',
      authorId: user2.id,
      articleId: article1.id,
    },
  });

  await prisma.productLike.create({
    data: {
      userId: user2.id,
      productId: product1.id,
    },
  });

  await prisma.articleLike.create({
    data: {
      userId: user2.id,
      articleId: article1.id,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
