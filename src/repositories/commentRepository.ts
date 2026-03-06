import prisma from '../lib/prismaClient';

const commentInclude = { user: true };

export async function findCommentsByArticleId(params: {
  articleId: number;
  cursor?: number;
  limit: number;
}) {
  const { articleId, cursor, limit } = params;
  return prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: commentInclude,
  });
}

export async function findCommentsByProductId(params: {
  productId: number;
  cursor?: number;
  limit: number;
}) {
  const { productId, cursor, limit } = params;
  return prisma.comment.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: commentInclude,
  });
}

export async function findCommentById(id: number) {
  return prisma.comment.findUnique({ where: { id }, include: commentInclude });
}

export async function createArticleComment(data: {
  content: string;
  articleId: number;
  userId: number;
}) {
  return prisma.comment.create({ data, include: commentInclude });
}

export async function createProductComment(data: {
  content: string;
  productId: number;
  userId: number;
}) {
  return prisma.comment.create({ data, include: commentInclude });
}

export async function updateComment(id: number, content: string) {
  return prisma.comment.update({
    where: { id },
    data: { content },
    include: commentInclude,
  });
}

export async function deleteComment(id: number) {
  return prisma.comment.delete({ where: { id } });
}
