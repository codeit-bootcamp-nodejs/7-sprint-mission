import { ForbiddenError } from "../lib/errors.js";
import { IdParams, ProductIdParams } from "../validation/commons.schema";
import {
  CreateProduct,
  GetProductList,
  UpdateProduct,
} from "../validation/products.schema";
import {
  CreateComment,
  GetCommentListParams,
} from "../validation/comments.schema";
import {
  createProductService,
  getProductService,
  updateProductService,
  deleteProductService,
  getProductListService,
  createProductCommentService,
  likeProductService,
  unlikeProductService,
  getProductCommentList
} from "../services/product.service";
import type { Request, Response } from "express";

function requireUserId(req: Request): number {
  if (!req.user?.id) throw new ForbiddenError("로그인이 필요합니다.");
  return req.user.id;
}

export async function createProduct(req: Request, res: Response) {
  const userId = requireUserId(req);
  const input = CreateProduct.parse(req.body);
  const result = await createProductService(userId, input);
  res.status(201).send(result);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = IdParams.parse(req.params);
  const userId = req.user?.id ?? null;
  const dto = await getProductService(id, userId);

  res.json(dto);
}

export async function updateProduct(req: Request, res: Response) {
  const userId = requireUserId(req);
  const { id } = IdParams.parse(req.params);
  const input = UpdateProduct.parse(req.body);
  const dto = await updateProductService(id, userId, input);

  res.json(dto);
}

export async function deleteProduct(req: Request, res: Response) {
  const userId = requireUserId(req);
  const { id } = IdParams.parse(req.params);
  await deleteProductService(id, userId);

  res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const query = GetProductList.parse(req.query);
  const result = await getProductListService(query);
}

//product comment 관련
export async function createProductComment(req: Request, res: Response) {
  const userId = requireUserId(req)
  const { id: productId } = IdParams.parse(req.params);
  const body = CreateComment.parse(req.body);
  const dto = await createProductCommentService(userId, productId, body);

  res.status(201).json(dto);
}

export const likeProduct = async (req: Request, res: Response) => {
  const userId = requireUserId(req)
  const { productId } = ProductIdParams.parse(req.params);
  await likeProductService(userId, productId);
  return res.status(201).json({ message: "liked" });
};

export const unlikeProduct = async (req: Request, res: Response) => {
  const userId = requireUserId(req)
  const { productId } = ProductIdParams.parse(req.params);
  await unlikeProductService(userId, productId);
  return res.status(200).json({ message: "unliked" });
};


export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = IdParams.parse(req.params);
  const { cursor, limit } = GetCommentListParams.parse(req.query);

  const result = await getProductCommentList({
    productId,
    cursor: cursor ?? null,
    limit,
  });

  return res.send(result);
}