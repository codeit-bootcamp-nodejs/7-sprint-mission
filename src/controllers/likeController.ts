import type { Request, Response } from "express";

import * as likeService from "../services/likeService.js";
import { HttpError } from "../../errors/customErrors.js";


// id 문자열 → bigint 변환
function parseBigIntId(value: string, resourceName: string): bigint {
  try {
    return BigInt(value);
  } catch {
    throw new HttpError(`${resourceName} id가 올바르지 않습니다.`, 400);
  }
}


// 로그인 필수 userId 추출
function getRequiredUserId(req: Request): bigint {
  const userId = req.user?.userId;

  if (!userId) {
    throw new HttpError("인증이 필요합니다.", 401);
  }

  return BigInt(userId);
}


// 좋아요 생성 요청 파라미터 추출
function getLikeParams(
  req: Request<{ id: string }>,
  resourceName: "상품" | "게시글"
) {
  const targetId = parseBigIntId(req.params.id, resourceName);
  const userId = getRequiredUserId(req);

  return { targetId, userId };
}


// 상품 좋아요
export const likeProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { targetId: productId, userId } = getLikeParams(req, "상품");

  await likeService.likeProduct({ userId, productId });

  res.status(204).send();
};


// 상품 좋아요 취소
export const unlikeProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { targetId: productId, userId } = getLikeParams(req, "상품");

  await likeService.unlikeProduct({ userId, productId });

  res.status(204).send();
};


// 게시글 좋아요
export const likeArticle = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { targetId: articleId, userId } = getLikeParams(req, "게시글");

  await likeService.likeArticle({ userId, articleId });

  res.status(204).send();
};


// 게시글 좋아요 취소
export const unlikeArticle = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { targetId: articleId, userId } = getLikeParams(req, "게시글");

  await likeService.unlikeArticle({ userId, articleId });

  res.status(204).send();
};