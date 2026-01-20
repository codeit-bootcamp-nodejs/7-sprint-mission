import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import { UpdateCommentBodyStruct } from "../structs/commentsStruct.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import { IdParamsStruct } from "../structs/commonStructs.js";
import { Prisma } from "@prisma/client/extension";

export async function updateComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingComment = await Prisma.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }

  const updatedComment = await p;
}
