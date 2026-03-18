import { prisma } from "../lib/prismaClient";

export function createComment(data: {
  content: string;
  userId: number;
  productId: number;
}) {
  return prisma.comment.create({
    data,
    select: {
      id: true,
      content: true,
      userId: true,
      productId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
