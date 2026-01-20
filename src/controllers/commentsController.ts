import { Request, Response } from "express";
import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import {
  CreateCommentBodyStruct,
  UpdateCommentBodyStruct,
} from "../structs/commentsStructs.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import { IdParamsStruct } from "../structs/commonStructs.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export async function createComment(req: any, res: Response) {
  const { content, articleId, productId } = create(
    req.body,
    CreateCommentBodyStruct
  ) as any;
  if (!articleId && !productId) {
    return res.status(400).json({ message: "어디에 다는 댓글인지 알려줘용" });
  }
  const comment = await prismaClient.comment.create({
    data: {
      content,
      userId: Number(req.user.id),
      articleId: articleId ? Number(articleId) : undefined,
      productId: productId ? Number(productId) : undefined,
    },
  });
  return res.status(201).send(comment);
}

export async function updateComment(req: any, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await prismaClient.comment.findUnique({
    where: { id: Number(id) },
  });
  if (!existingComment) {
    throw new NotFoundError("comment", String(id));
  }
  if (existingComment.userId !== Number(req.user.id)) {
    return res.status(403).json({ message: "자신의 댓글만 수정 가능합니다." });
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id: Number(id) },
    data: { content },
  });

  return res.send(updatedComment);
}

export async function deleteComment(req: any, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const existingComment = await prismaClient.comment.findUnique({
    where: { id: Number(id) },
  });
  if (!existingComment) {
    throw new NotFoundError("comment", String(id));
  }
  if (existingComment.userId !== req.user.id) {
    return res.status(403).json({ message: "자신의 댓글만 삭제 가능합니다." });
  }
  await prismaClient.comment.delete({ where: { id: Number(id) } });

  return res.status(204).send();
}
