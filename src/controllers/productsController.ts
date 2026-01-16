import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import { Request, Response } from 'express';
import * as productService from '../services/productService';

export async function createProduct(req : Request, res : Response) {
  const data = create(req.body, CreateProductBodyStruct);
  const createdProduct = await productService.createProduct({
    ...data,
    userId: req.user!.id,
  }); 
  res.status(201).send(createdProduct);
}

export async function getProduct(req : Request, res : Response) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productService.getProduct(id, req.user?.id);
  return res.send(product);
}

export async function updateProduct(req : Request, res : Response) {

  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);

  const updatedProduct = await productService.updateProduct(id,
    { name, description, price, tags, images },
    { id: req.user!.id }); 
    
  return res.send(updatedProduct);
}

export async function deleteProduct(req : Request, res : Response) {
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(id, { id: req.user!.id });
  return res.status(204).send();
}

export async function getProductList(req : Request, res : Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;

 
  const totalCount = await productService.countProducts(where);    
  const products = await productService.getProductList({
    page,
    pageSize,
    orderBy: orderBy ?? 'recent',
    keyword,
    userId: req.user?.id,
  });
  
  return res.send({ list: products, totalCount });
}   
export async function createComment(req : Request, res : Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const createdComment = await productService.createComment({
    productId,
    content,
    userId: req.user.id,
  }); 
  return res.status(201).send(createdComment);
}

export async function getCommentList(req : Request, res : Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const { list: comments, nextCursor } = await productService.getCommentList({
    productId,
    cursor: cursor ? Number(cursor) : undefined,
    limit,
  }); 
  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function createFavorite(req : Request, res : Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.createFavorite({ productId, userId: req.user!.id });
  return res.status(201).send();
}

export async function deleteFavorite(req : Request, res : Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.deleteFavorite(productId, req.user!.id);
  return res.status(204).send();
}
