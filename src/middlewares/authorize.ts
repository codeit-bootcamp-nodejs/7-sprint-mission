import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/prisma.js";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} from "../../errors/customErrors.js";
import { string } from "../../utils/validation.js";

const parseIdParam = (req: Request): bigint => {
  const raw = string(req.params.id);
  try {
    return BigInt(raw);
  } catch {
    throw new BadRequestError();
  }
};

const getAuthUserId = (req: Request): bigint => {
  const raw = req.user?.userId;
  if (!raw) throw new UnauthorizedError();

  try {
    return BigInt(raw);
  } catch {
    throw new UnauthorizedError();
  }
};


// 상품 인가
export const authorizeProductOwner = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const id = parseIdParam(req);
  const userId = getAuthUserId(req);

  const entity = await prisma.product.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!entity) throw new NotFoundError("상품을 찾을 수 없습니다.");
  if (entity.user_id !== userId) throw new ForbiddenError();

  next();
};

// 게시글 인가
export const authorizeArticleOwner = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const id = parseIdParam(req);
  const userId = getAuthUserId(req);

  const entity = await prisma.article.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!entity) throw new NotFoundError("게시글을 찾을 수 없습니다.");
  if (entity.user_id !== userId) throw new ForbiddenError();

  next();
};

// 댓글 인가
export const authorizeCommentOwner = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const id = parseIdParam(req);
  const userId = getAuthUserId(req);

  const entity = await prisma.comment.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!entity) throw new NotFoundError("댓글을 찾을 수 없습니다.");
  if (entity.user_id !== userId) throw new ForbiddenError();

  next();
};
