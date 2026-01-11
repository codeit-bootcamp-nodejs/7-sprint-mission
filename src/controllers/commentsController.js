import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import {
  CreateCommentBodyStruct,
  UpdateCommentBodyStruct,
} from "../structs/commentsStructs.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import { IdParamsStruct } from "../structs/commonStructs.js";

export async function createComment(req, res) {
  const { content, articleId, productId } = create(
    req.body,
    CreateCommentBodyStruct
  );
  const commentData = {
    content,
    userId: req.user.id,
  };
  if (articleId) {
    commentData.articleId = articleId;
  } else if (productId) {
    commentData.productId = productId;
  } else {
    return res.status(400).json({ message: "어디에 다는 댓글인지 알려줘" });
  }
  const comment = await prismaClient.comment.create({
    data: {
      commentData,
    },
  });
  return res.status(201).send(comment);
}

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
    return res.status(403).json({ message: "자신의 댓글만 수정 가능합니다." });
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
    return res.status(403).json({ message: "자신의 댓글만 삭제 가능합니다." });
  }
  await prismaClient.comment.delete({ where: { id } });

  return res.status(204).send();
}
