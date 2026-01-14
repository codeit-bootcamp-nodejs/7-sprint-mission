import { prisma } from "../../prisma/prisma.js";

export const getCommentById = async (id) => {
  return prisma.comment.findUnique({
    where: { id },
  });
};

export const updateComment = async (id, data) => {
  return prisma.comment.update({
    where: { id },
    data,
  });
};

export const deleteComment = async (id) => {
  return prisma.comment.delete({
    where: { id },
  });
};
