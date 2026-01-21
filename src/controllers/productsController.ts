import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { productService } from '../services/productService';
import { commentService } from '../services/commentService';
import { AuthenticatedRequest } from '../types/express';

export async function createProduct(req: Request, res: Response) {
  const {user, body} = req as AuthenticatedRequest;
  const data = create(body, CreateProductBodyStruct);
  const product = await productService.createProduct(user.id, data);
  res.status(201).send(product);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productService.getProduct(id, req.user);
  return res.send(product);
}

export async function updateProduct(req: Request, res: Response) {
  const {user, body, params} = req as AuthenticatedRequest;
  const { id } = create(params, IdParamsStruct);
  const data = create(body, UpdateProductBodyStruct);
  const updated = await productService.updateProduct(user.id, id, data);
  return res.send(updated);
}

export async function deleteProduct(req: Request, res: Response) {
  const {user, params} = req as AuthenticatedRequest;
  const { id } = create(params, IdParamsStruct);
  await productService.deleteProduct(user.id, id);
  return res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);
  const result = await productService.getList(page, pageSize, orderBy, keyword);
  return res.send(result);
}

export async function createComment(req: Request, res: Response) {
  const {user, body, params} = req as AuthenticatedRequest;
  const { id: productId } = create(params, IdParamsStruct);
  const data = create(body, CreateCommentBodyStruct);
  const comment = await commentService.createComment(user.id, productId, data, 'product');
  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
  const result = await commentService.getComments(productId, 'product', cursor, limit);

  return res.send(result);
}

export async function productLike(req: Request, res: Response) {
  const {user, params} = req as AuthenticatedRequest;
  const { id: productId } = create(params, IdParamsStruct);
  const result = await productService.toggleLike(user.id, productId);

  if (result.isLiked) {
    return res.status(201).send();
  } else {
    return res.status(204).send();
  }
}