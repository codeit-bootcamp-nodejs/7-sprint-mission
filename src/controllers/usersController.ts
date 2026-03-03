import { Request, Response } from 'express';
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
import { getMyNotificationParamsStruct, UpdateNotificationReadStruct } from '../structs/notificationStructs';

export async function getMe(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await prismaClient.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    throw new NotFoundError('user', req.user.id);
  }

  const { password: _, ...userWithoutPassword } = user;
  res.send(userWithoutPassword);
}

export async function updateMe(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, UpdateMeBodyStruct);

  const updatedUser = await prismaClient.user.update({
    where: { id: req.user.id },
    data,
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  res.status(200).send(userWithoutPassword);
}

export async function updateMyPassword(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);

  const user = await prismaClient.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    throw new NotFoundError('user', req.user.id);
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

  res.status(200).send();
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
      favorites: true,
    },
  });

  const productsWithFavorites = products.map((product) => ({
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: product.favorites.some((favorite) => favorite.userId === req.user.id),
  }));

  res.send({
    list: productsWithFavorites,
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
      favorites: {
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
      favorites: {
        some: {
          userId: req.user.id,
        },
      },
    },
    include: {
      favorites: true,
    },
  });

  const productsWithFavorites = products.map((product) => ({
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: true,
  }));

  res.send({
    list: productsWithFavorites,
    totalCount,
  });
}

export async function getMyNotifications(req: Request, res:Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const userId = req.user.id;

  const {cursor, limit} = create(
    req.query,
    getMyNotificationParamsStruct
  );

  const whereCondition = {
    userId,
    ...(cursor && { id: { lt: cursor } }),
  };

  const notifications = await prismaClient.notification.findMany({
    where: whereCondition,
    orderBy: { id: 'desc' },
    take: limit,
  });

  const totalCount = await prismaClient.notification.count({
    where: { userId }
  })

  const unreadCount = await prismaClient.notification.count({
    where: { 
      userId,
      read: false,
    },
  });

  const nextCursor = 
  notifications.length === limit
  ? notifications[notifications.length - 1].id
  : null;

  res.send({
    list: notifications,
    nextCursor,
    unreadCount,
    totalCount,
  })
}

export async function markNotificationsAsRead(req: Request, res:Response) {
  if(!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { notificationIds } = create(
    req.body,
    UpdateNotificationReadStruct
  );

  await prismaClient.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId: req.user.id,
    },
    data: {
      read: true,
    },
  });

  res.status(200).send();
}