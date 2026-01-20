import { create } from 'superstruct';
import { productService } from '../services/productsService.js';
import { productRepository } from '../repositories/productsRepository.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  UpdateProductBodyStruct,
  GetProductListParamsStruct,
} from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import type { Request, Response } from 'express';

export async function createProduct(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const data = create(req.body, CreateProductBodyStruct);
  const product = await productRepository.create({ ...data, userId: req.user.id });
  return res.status(201).send(product);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await productService.getProduct(id, req.user?.id);
  return res.send(result);
}

export async function getProductList(req: Request, res: Response) {
  const query = create(req.query, GetProductListParamsStruct);
  const result = await productService.getProductList(query, req.user?.id);
  return res.send(result);
}

export async function updateProduct(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const updated = await productService.updateProduct(id, req.user.id, data);
  return res.send(updated);
}

export async function deleteProduct(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(id, req.user.id);
  return res.status(204).send();
}

export async function createComment(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct) as { content: string };
  const comment = await productService.createComment(productId, req.user.id, content);
  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const query = create(req.query, GetCommentListParamsStruct);
  const result = await productService.getCommentList(productId, query);
  return res.send(result);
}

export async function createFavorite(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.toggleFavorite(productId, req.user.id, true);
  return res.status(201).send();
}

export async function deleteFavorite(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.toggleFavorite(productId, req.user.id, false);
  return res.status(204).send();
}
