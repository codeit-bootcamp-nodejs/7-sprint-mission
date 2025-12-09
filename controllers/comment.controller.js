import * as commentService from "../services/comment.service.js";
import { NotFoundError } from "../middlewares/CustomError.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 상품 댓글 등록
export const createProductComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // productId
  const { content } = req.body;

  const comment = await commentService.createComment({
    content,
    productId: parseInt(id),
  });
  res.status(201).json(comment);
});

// 게시글 댓글 등록
export const createArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // articleId
  const { content } = req.body;

  const comment = await commentService.createComment({
    content,
    articleId: parseInt(id),
  });
  res.status(201).json(comment);
});

// 댓글 수정
export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  // 존재 여부 확인은 Prisma가 에러(P2025)를 던지거나 Service에서 처리 가능하지만
  // 안전하게 확인 로직을 추가할 수도 있습니다. 여기선 Prisma 에러 핸들링에 맡깁니다.
  const updatedComment = await commentService.updateComment(commentId, content);
  res.status(200).json(updatedComment);
});

// 댓글 삭제
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  await commentService.deleteComment(commentId);
  res.status(204).send();
});
