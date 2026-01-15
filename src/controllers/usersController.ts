import type { Request, Response } from 'express';
import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
} from '../structs/usersStructs';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export async function getMe(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await prismaClient.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    throw new NotFoundError('user', req.user.id.toString());
  }

  const { password: _, ...userWithoutPassword } = user;
  return res.send(userWithoutPassword);
}

export async function updateMe(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { nickname, image } = create(req.body, UpdateMeBodyStruct);

  const updatedUser = await prismaClient.user.update({
    where: { id: req.user.id },
    data: {
      ...(nickname !== undefined && { nickname }),
      ...(image !== undefined && { image }),
    },
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return res.status(200).send(userWithoutPassword);
}

export async function updateMyPassword(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);

  const user = await prismaClient.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    throw new NotFoundError('user', req.user.id.toString());
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prismaClient.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  return res.status(200).send();
}

export async function getMyProductList(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};

  const totalCount = await prismaClient.product.count({
    where: {
      ...where,
      userId: req.user.id,
    },
  });

  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...where,
      userId: req.user.id,
    },
    include: {
      likes: true,
    },
  });

  const productsWithLikes = products.map((product) => ({
    ...product,
    likes: undefined,
    favoriteCount: product.likes.length,
    isFavorited: product.likes.some((like) => like.userId === req.user!.id),
  }));

  return res.send({
    list: productsWithLikes,
    totalCount,
  });
}

export async function getMyFavoriteList(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyFavoriteListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};

  const totalCount = await prismaClient.product.count({
    where: {
      ...where,
      likes: {
        some: {
          userId: req.user.id,
        },
      },
    },
  });

  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...where,
      likes: {
        some: {
          userId: req.user.id,
        },
      },
    },
    include: {
      likes: true,
    },
  });

  const productsWithLikes = products.map((product) => ({
    ...product,
    likes: undefined,
    favoriteCount: product.likes.length,
    isFavorited: true,
  }));

  return res.send({
    list: productsWithLikes,
    totalCount,
  });
}
