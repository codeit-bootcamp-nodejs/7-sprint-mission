import { prisma } from "../../prisma/prisma.js";
import { HttpError } from "../../errors/customErrors.js";

// 상품 인가
export const authorizeProductOwner = async (req, res, next) => {
  const productId = BigInt(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, user_id: true },
  });

  if (!product) throw new HttpError("상품을 찾을 수 없습니다.", 404);
  if (product.user_id !== req.user.id) throw new HttpError("권한이 없습니다.", 403);

  next();
};

// 게시글 인가
export const authorizeArticleOwner = async (req, res, next) => {
  const articleId = BigInt(req.params.id);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, user_id: true },
  });

  if (!article) throw new HttpError("게시글을 찾을 수 없습니다.", 404);
  if (article.user_id !== req.user.id) throw new HttpError("권한이 없습니다.", 403);

  next();
};

// 댓글 인가
export const authorizeCommentOwner = async (req, res, next) => {
  const commentId = BigInt(req.params.id);

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, user_id: true },
  });

  if (!comment) throw new HttpError("댓글을 찾을 수 없습니다.", 404);
  if (comment.user_id !== req.user.id) throw new HttpError("권한이 없습니다.", 403);

  next();
};
