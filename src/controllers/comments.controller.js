import { prisma } from "../lib/prismaClient.js";
import { NotFoundError } from "../lib/errors.js";
import { IdParams } from "../validation/commons.js";
import { UpdateComment } from "../validation/comments.js";

export async function updateComment(req, res) {
  const userId = req.user.id;
  const { id } = IdParams.parse(req.params);
  const { content } = UpdateComment.parse(req.body);

  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!existing) throw new NotFoundError("comment", id);
  if (existing.userId !== userId) {
    throw new ForbiddenError("작성자만 수정할 수 있습니다.");
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  return res.json(updated);
}

export async function deleteComment(req, res) {
  const userId = req.user.id;
  const { id } = IdParams.parse(req.params);

  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!existing) throw new NotFoundError("comment", id);
  if (existing.userId !== userId) {
    throw new ForbiddenError("작성자만 삭제할 수 있습니다.");
  }

  await prisma.comment.delete({ where: { id } });
  return res.status(204).send();
}
