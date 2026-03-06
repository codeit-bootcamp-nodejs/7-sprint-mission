import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { CreateProductStruct, UpdateProductStruct } from '../structs/productStructs';
import { CreateCommentStruct } from '../structs/commentStructs';
import * as productService from '../services/productService';
import * as commentService from '../services/commentService';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await productService.getProducts({
      orderBy: String(req.query.orderBy ?? 'recent'),
      page: parseInt(String(req.query.page ?? '1')),
      pageSize: parseInt(String(req.query.pageSize ?? '10')),
      keyword: req.query.keyword ? String(req.query.keyword) : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.getProduct(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, CreateProductStruct);
    const product = await productService.createProduct({
      ...req.body,
      userId: req.user!.id,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, UpdateProductStruct);
    const product = await productService.updateProduct(
      parseInt(req.params.id),
      req.user!.id,
      req.body
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await productService.deleteProduct(parseInt(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function favoriteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.favoriteProduct(
      parseInt(req.params.id),
      req.user!.id
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function unfavoriteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.unfavoriteProduct(
      parseInt(req.params.id),
      req.user!.id
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function getProductComments(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(String(req.query.limit ?? '10'));
    const cursor = req.query.cursor ? parseInt(String(req.query.cursor)) : undefined;
    const result = await commentService.getProductComments({
      productId: parseInt(req.params.id),
      limit,
      cursor,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createProductComment(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, CreateCommentStruct);
    const comment = await commentService.createProductComment({
      content: req.body.content,
      productId: parseInt(req.params.id),
      userId: req.user!.id,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}
