import { Request, Response } from 'express';
import { prismaClient } from '../lib/prismaClient.js';
import { UserRepository } from '../repositories/userRepository.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { FavoriteRepository } from '../repositories/favoriteRepository.js';
import { UserService } from '../services/userService.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { pageParamsSchema } from '../schemas/commonSchemas.js';
import { updateMeSchema, updatePasswordSchema } from '../schemas/userSchemas.js';

// Initialize repositories and services
const userRepository = new UserRepository(prismaClient);
const productRepository = new ProductRepository(prismaClient);
const favoriteRepository = new FavoriteRepository(prismaClient);

const userService = new UserService(userRepository, productRepository, favoriteRepository);

export async function getMe(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const userWithoutPassword = await userService.getMe(req.user.id);
  return res.send(userWithoutPassword);
}

export async function updateMe(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = updateMeSchema.parse(req.body);
  const userWithoutPassword = await userService.updateMe(req.user.id, data);

  return res.status(200).send(userWithoutPassword);
}

export async function updateMyPassword(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = updatePasswordSchema.parse(req.body);
  await userService.updatePassword(req.user.id, data);

  return res.status(200).send();
}

export async function getMyProductList(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { page, pageSize, orderBy, keyword } = pageParamsSchema.parse(req.query);

  const result = await userService.getMyProducts(
    req.user.id,
    page,
    pageSize,
    orderBy || 'recent',
    keyword
  );

  return res.send(result);
}

export async function getMyFavoriteList(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { page, pageSize, orderBy, keyword } = pageParamsSchema.parse(req.query);

  const result = await userService.getMyFavorites(
    req.user.id,
    page,
    pageSize,
    orderBy || 'recent',
    keyword
  );

  return res.send(result);
}
