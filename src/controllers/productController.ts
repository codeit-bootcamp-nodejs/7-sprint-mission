import type { Request, Response } from "express";

import * as productService from "../services/productService.js";
import * as notificationService from "../services/notificationService.js";

import { Product } from "../constructors/product.js";
import { Comment } from "../constructors/comment.js";
import { NotFoundError, BadRequestError } from "../../errors/customErrors.js";

import {
  string,
  optionalString,
  positiveInt,
  optionalStringArray,
  optionalPositiveInt,
  optionalInt,
} from "../../utils/validation.js";

import type {
  CreateProductDto,
  UpdateProductDto,
  GetProductDto,
  DeleteProductDto,
  ListProductsDto,
  CreateProductCommentDto,
  ListProductCommentsCursorDto,
  ProductSort,
} from "../dtos/product.dto.js";

type ProductParams = { id: string };

type CreateProductBody = {
  name?: unknown;
  description?: unknown;
  price?: unknown;
  tags?: unknown;
};

type UpdateProductBody = {
  name?: unknown;
  description?: unknown;
  price?: unknown;
  tags?: unknown;
};

type ListProductsQuery = {
  limit?: unknown;
  offset?: unknown;
  sort?: unknown;
  search?: unknown;
};

type CreateCommentBody = { content?: unknown };

type ListCommentsQuery = {
  limit?: unknown;
  cursorId?: unknown;
};

export const create = async (
  req: Request<unknown, unknown, CreateProductBody>,
  res: Response
) => {
  const dto: CreateProductDto = {
    userId: BigInt(req.user!.userId),
    name: string(req.body.name, "상품명을 입력해 주세요."),
    price: positiveInt(req.body.price, "가격을 입력해 주세요."),
    description: optionalString(req.body.description),
    tags: optionalStringArray(req.body.tags) ?? [],
  };

  const entity = await productService.createProduct(dto);
  res.status(201).json(Product.fromEntity(entity));
};

export const detail = async (req: Request<ProductParams>, res: Response) => {
  const dto: GetProductDto = {
    id: BigInt(req.params.id),
    userId: req.user ? BigInt(req.user.userId) : null,
  };

  const entity = await productService.getProductById(dto);
  if (!entity) throw new NotFoundError("상품을 찾을 수 없습니다.");

  res.json(Product.fromEntity(entity));
};

export const update = async (
  req: Request<ProductParams, unknown, UpdateProductBody>,
  res: Response
) => {
  const id = BigInt(req.params.id);
  const requesterId = req.user!.userId;

  const exists = await productService.getProductById({
    id,
    userId: null,
  });

  if (!exists) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }

  const dto: UpdateProductDto = { id };

  if (req.body.name !== undefined) {
    dto.name = string(req.body.name, "상품명을 입력해 주세요.");
  }

  if (req.body.price !== undefined) {
    dto.price = positiveInt(req.body.price);
  }

  if (req.body.description !== undefined) {
    dto.description = string(req.body.description);
  }

  if (req.body.tags !== undefined) {
    dto.tags = optionalStringArray(req.body.tags) ?? [];
  }

  const oldPrice = exists.price;
  const updated = await productService.updateProduct(dto);

  // 가격이 바뀐 경우 알림 생성
  if (dto.price !== undefined && oldPrice !== updated.price) {
    const likerUserIds = await productService.getProductLikeUserIds(id);

    // 본인 알림 제외
    const targetUserIds = likerUserIds.filter(
      (userId) => userId.toString() !== requesterId
    );

    await Promise.all(
      targetUserIds.map((userId) =>
        notificationService.createNotification({
          userId: userId.toString(),
          type: "PRODUCT_PRICE_CHANGED",
          resourceType: "PRODUCT",
          resourceId: id.toString(),
          message: "좋아요한 상품의 가격이 변경되었습니다.",
        })
      )
    );
  }

  res.json(Product.fromEntity(updated));
};

export const remove = async (req: Request<ProductParams>, res: Response) => {
  const id = BigInt(req.params.id);

  const exists = await productService.getProductById({ id, userId: null });
  if (!exists) throw new NotFoundError("상품을 찾을 수 없습니다.");

  const dto: DeleteProductDto = { id };
  await productService.deleteProduct(dto);

  res.status(204).send();
};

export const list = async (
  req: Request<unknown, unknown, unknown, ListProductsQuery>,
  res: Response
) => {
  const userId = req.user ? BigInt(req.user.userId) : null;

  const sortRaw = optionalString(req.query.sort);
  let sort: ProductSort | undefined;

  if (sortRaw !== undefined) {
    if (sortRaw !== "recent") {
      throw new BadRequestError("정렬 기준이 올바르지 않습니다.");
    }
    sort = "recent";
  }

  const dto: ListProductsDto = {
    limit: optionalPositiveInt(req.query.limit),
    offset: optionalInt(req.query.offset),
    sort,
    search: optionalString(req.query.search),
    userId,
  };

  const entities = await productService.listProducts(dto);
  res.json(entities.map(Product.fromEntity));
};

export const createComment = async (
  req: Request<ProductParams, unknown, CreateCommentBody>,
  res: Response
) => {
  const productId = BigInt(req.params.id);

  const product = await productService.getProductById({
    id: productId,
    userId: null,
  });

  if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");

  const dto: CreateProductCommentDto = {
    userId: BigInt(req.user!.userId),
    productId,
    content: string(req.body.content),
  };

  const commentEntity = await productService.createProductComment(dto);
  res.status(201).json(Comment.fromEntity(commentEntity));
};

export const listComments = async (
  req: Request<ProductParams, unknown, unknown, ListCommentsQuery>,
  res: Response
) => {
  const productId = BigInt(req.params.id);

  const cursorIdStr = optionalString(req.query.cursorId);

  const dto: ListProductCommentsCursorDto = {
    productId,
    limit: optionalPositiveInt(req.query.limit),
    cursorId: cursorIdStr ? BigInt(cursorIdStr) : undefined,
  };

  const { entities, nextCursorId } =
    await productService.listProductCommentsCursor(dto);

  res.status(200).json({
    items: entities.map(Comment.fromEntity),
    nextCursorId,
  });
};