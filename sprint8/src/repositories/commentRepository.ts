import { User } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export async function updateComment(commentId: number, content: string) {
  // Implementation here
    const updatedComment = await prismaClient.comment.update({
    where: { id: commentId },
    data: { content },
  });
  return updatedComment;
}

export async function deleteComment(commentId: number) {
  // Implementation here
  return prismaClient.comment.delete({
    where: { id: commentId }
  });
}

export async function getCommentById(commentId: number) {
  return prismaClient.comment.findUnique({
    where: { id: commentId }
  });
}