import { Request, Response } from 'express';
import { prismaClient } from '../lib/prismaClient.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { FavoriteRepository } from '../repositories/favoriteRepository.js';
import { CommentRepository } from '../repositories/commentRepository.js';
import { ProductService } from '../services/productService.js';
import { CommentService } from '../services/commentService.js';
import { ArticleRepository } from '../repositories/articleRepository.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import {
  idParamsSchema,
  pageParamsSchema,
  cursorParamsSchema,
} from '../schemas/commonSchemas.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/productSchemas.js';
import { createCommentSchema } from '../schemas/commentSchemas.js';

// Initialize repositories and services
const productRepository = new ProductRepository(prismaClient);
const favoriteRepository = new FavoriteRepository(prismaClient);
const commentRepository = new CommentRepository(prismaClient);
const articleRepository = new ArticleRepository(prismaClient);

const productService = new ProductService(productRepository, favoriteRepository);
const commentService = new CommentService(commentRepository, productRepository, articleRepository);

export async function createProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = createProductSchema.parse(req.body);
  const createdProduct = await productService.createProduct(req.user.id, data);

  res.status(201).send(createdProduct);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = idParamsSchema.parse(req.params);
  const product = await productService.getProduct(id, req.user?.id);
  
  return res.send(product);
}

export async function updateProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = idParamsSchema.parse(req.params);
  const data = updateProductSchema.parse(req.body);

  const updatedProduct = await productService.updateProduct(id, req.user.id, data);

  return res.send(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = idParamsSchema.parse(req.params);
  await productService.deleteProduct(id, req.user.id);

  return res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = pageParamsSchema.parse(req.query);

  const result = await productService.getProductList(
    page,
    pageSize,
    orderBy || 'recent',
    keyword,
    req.user?.id
  );

  return res.send(result);
}

export async function createComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = idParamsSchema.parse(req.params);
  const data = createCommentSchema.parse(req.body);

  const createdComment = await commentService.createProductComment(
    productId,
    req.user.id,
    data
  );

  return res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = idParamsSchema.parse(req.params);
  const { cursor, limit } = cursorParamsSchema.parse(req.query);

  const result = await commentService.getProductComments(productId, cursor, limit);

  return res.send(result);
}

export async function createFavorite(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = idParamsSchema.parse(req.params);
  await productService.createFavorite(productId, req.user.id);

  return res.status(201).send();
}

export async function deleteFavorite(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = idParamsSchema.parse(req.params);
  await productService.deleteFavorite(productId, req.user.id);

  return res.status(204).send();
}
