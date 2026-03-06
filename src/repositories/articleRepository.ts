import prisma from '../lib/prismaClient';
import { Prisma } from '@prisma/client';

const articleInclude = {
  user: true,
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.ArticleInclude;

export async function findArticles(params: {
  orderBy: 'recent' | 'like';
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  const { orderBy, page, pageSize, keyword } = params;
  const where: Prisma.ArticleWhereInput = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {};

  const order: Prisma.ArticleOrderByWithRelationInput =
    orderBy === 'like' ? { likes: { _count: 'desc' } } : { createdAt: 'desc' };

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: order,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: articleInclude,
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, totalCount };
}

export async function findArticleById(id: number) {
  return prisma.article.findUnique({
    where: { id },
    include: articleInclude,
  });
}

export async function createArticle(data: {
  title: string;
  content: string;
  image?: string;
  userId: number;
}) {
  return prisma.article.create({ data, include: articleInclude });
}

export async function updateArticle(
  id: number,
  data: { title?: string; content?: string; image?: string }
) {
  return prisma.article.update({ where: { id }, data, include: articleInclude });
}

export async function deleteArticle(id: number) {
  return prisma.article.delete({ where: { id } });
}

export async function findLike(articleId: number, userId: number) {
  return prisma.like.findFirst({ where: { articleId, userId } });
}

export async function createLike(articleId: number, userId: number) {
  return prisma.like.create({ data: { articleId, userId } });
}

export async function deleteLike(articleId: number, userId: number) {
  return prisma.like.deleteMany({ where: { articleId, userId } });
}
