import * as productService from "../services/productService.js";
import { Product } from "../constructors/product.js";
import { Comment } from "../constructors/comment.js";
import { HttpError, NotFoundError } from "../../errors/customErrors.js";

export const create = async (req, res) => {
  const { name, description, price, tags } = req.body;

  const entity = await productService.createProduct({
    userId: req.user.id,
    name,
    description,
    price,
    tags,
  });

  res.status(201).json(Product.fromEntity(entity));
};

export const detail = async (req, res) => {
  const id = BigInt(req.params.id);
  const userId = req.user?.id ?? null;

  const entity = await productService.getProductById(id, userId);
  if (!entity) throw new NotFoundError("상품을 찾을 수 없습니다.");

  res.json(Product.fromEntity(entity));
};

export const update = async (req, res) => {
  const id = BigInt(req.params.id);

  const exists = await productService.getProductById(id);
  if (!exists) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }

  const updated = await productService.updateProduct(id, req.body);
  res.json(Product.fromEntity(updated));
};

export const remove = async (req, res) => {
  const id = BigInt(req.params.id);

  const exists = await productService.getProductById(id);
  if (!exists) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }

  await productService.deleteProduct(id);
  res.status(204).send();
};

export const list = async (req, res) => {
  const userId = req.user?.id ?? null;

  const entities = await productService.listProducts({
    ...req.query,
    userId,
  });

  res.json(entities.map(Product.fromEntity));
};


export const createComment = async (req, res) => {
  const productId = BigInt(req.params.id);
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new HttpError("댓글 내용을 입력해 주세요.", 400);
  }

  const product = await productService.getProductById(productId);
  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }

  const commentEntity = await productService.createProductComment({
    userId: req.user.id,
    productId,
    content,
  });

  res.status(201).json(Comment.fromEntity(commentEntity));
};

export const listComments = async (req, res) => {
  const productId = BigInt(req.params.id);
  const { limit, cursorId } = req.query;

  const { entities, nextCursorId } = await productService.listProductCommentsCursor({
    productId,
    limit,
    cursorId,
  });

  res.json({
    items: entities.map(Comment.fromEntity),
    nextCursorId,
  });
};
