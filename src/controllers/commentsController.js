import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import { UpdateCommentBodyStruct } from "../structs/commentsStruct.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import BadRequestError from "../lib/errors/BadRequestError.js";
import { IdParamsStruct } from "../structs/commonStructs.js";

export async function updateComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await prismaClient.comment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }

  if (existingComment.userId !== req.user.id) {
    throw new BadRequestError("댓글에 등록된 유저정보가 맞지 않습니다.");
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
  });

  return res.send(updatedComment);
}

export async function deleteComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingComment = await prismaClient.comment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }

  if (existingComment.userId !== req.user.id) {
    throw new BadRequestError("댓글에 등록된 유저정보가 맞지 않습니다.");
  }

  await prismaClient.comment.delete({ where: { id } });

  return res.status(204).send();
}
