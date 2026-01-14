import * as likeService from "../services/likeService.js";

// 좋아요 (상품)
export const likeProduct = async (req, res) => {
  const productId = BigInt(req.params.id);
  const userId = req.user.id;

  await likeService.likeProduct({ userId, productId });
  res.status(204).send();
};

// 좋아요 취소 (상품)
export const unlikeProduct = async (req, res) => {
  const productId = BigInt(req.params.id);
  const userId = req.user.id;

  await likeService.unlikeProduct({ userId, productId });
  res.status(204).send();
};

// 좋아요 (게시글)
export const likeArticle = async (req, res) => {
  const articleId = BigInt(req.params.id);
  const userId = req.user.id;

  await likeService.likeArticle({ userId, articleId });
  res.status(204).send();
};

// 좋아요 취소 (게시글)
export const unlikeArticle = async (req, res) => {
  const articleId = BigInt(req.params.id);
  const userId = req.user.id;

  await likeService.unlikeArticle({ userId, articleId });
  res.status(204).send();
};
