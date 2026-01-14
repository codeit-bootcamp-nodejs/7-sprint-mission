import * as commentService from "../services/commentService.js";
import { Comment } from "../constructors/comment.js";
import { HttpError, NotFoundError } from "../../errors/customErrors.js";

export const update = async (req, res) => {
  const id = BigInt(req.params.id);
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new HttpError("댓글 내용을 입력해 주세요.", 400);
  }

  const exists = await commentService.getCommentById(id);
  if (!exists) {
    throw new NotFoundError("댓글을 찾을 수 없습니다.");
  }

  const updated = await commentService.updateComment(id, { content });
  res.json(Comment.fromEntity(updated));
};

export const remove = async (req, res) => {
  const id = BigInt(req.params.id);

  const exists = await commentService.getCommentById(id);
  if (!exists) {
    throw new NotFoundError("댓글을 찾을 수 없습니다.");
  }

  await commentService.deleteComment(id);
  res.status(204).send();
};
