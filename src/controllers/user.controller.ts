import { prisma } from "../lib/prismaClient.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../lib/errors.js";
import {
  UpdateMe,
  ChangePassword,
  GetproductParams,
} from "../validation/user.schema";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

export function requireUser(req: Request) {
  if (!req.user) {
    throw new ForbiddenError("로그인이 필요합니다.");
  }
  return req.user;
}
function stripUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as {
    [K in keyof T as T[K] extends undefined ? never : K]: Exclude<
      T[K],
      undefined
    >;
  };
}
export async function getMe(req: Request, res: Response) {
  const authUser = requireUser(req);
  const data = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  //
  if (!data) {
    throw new NotFoundError("유저를 찾을 수 없습니다.");
  }

  return res.json(data);
}

export async function updateMe(req: Request, res: Response) {
  const authUser = requireUser(req);
  const parsed = UpdateMe.parse(req.body);
  const data = stripUndefined(parsed);

  const updated = await prisma.user.update({
    where: { id: authUser.id },
    data,
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.json(updated);
}

export async function changePassword(req: Request, res: Response) {
  const authUser = requireUser(req);
  const { currentPassword, newPassword } = ChangePassword.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { id: true, password: true },
  });

  if (!user) {
    throw new NotFoundError("유저를 찾을 수 없습니다.");
  }

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    throw new BadRequestError("현재 비밀번호가 일치하지 않습니다.");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: authUser.id },
    data: { password: hashed },
  });

  return res.json({ message: "비밀번호가 변경되었습니다." });
}

export async function getMyProducts(req: Request, res: Response) {
  const authUser = requireUser(req);

  const { page, pageSize } = GetproductParams.parse(req.query);

  const skip = (page - 1) * pageSize;

  const data = await prisma.product.findMany({
    where: { userId: authUser.id },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
    select: { id: true, name: true, price: true, createdAt: true },
  });

  return res.json({ data });
}

export async function likedProducts(req: Request, res: Response) {
  const authUser = requireUser(req);

  const likes = await prisma.productLike.findMany({
    where: { userId: authUser.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });

  return res.json(
    likes.map((like) => ({
      ...like.product,
      isLiked: true,
    })),
  );
}
