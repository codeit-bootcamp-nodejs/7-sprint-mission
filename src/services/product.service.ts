import type { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  CreateProduct,
  UpdateProduct,
  GetProductList,
} from "../validation/products.schema";
import { CreateComment } from "../validation/comments.schema";
import * as productRepo from "../repositories/product.repository";
import * as commentRepo from "../repositories/comment.repository.js";
import { toCommentDto, type CommentDto } from "../DTO/comment.js";
import {
  toProductBaseDto,
  toProductDetailDto,
  toProductBaseDtoList,
  type ProductBaseDto,
  type ProductDetailDto,
  type ProductEntityWithLikes,
} from "../DTO/product";
import { NotFoundError, ForbiddenError, ConflictError } from "../lib/errors";

//---------------------------------------------------------

type ProductOwnerInfo = { id: number; userId: number };

async function requireProductOwner(
  productId: number,
  userId: number
): Promise<ProductOwnerInfo> {
  const existing = await productRepo.findProductOwner(productId);
  if (!existing) {
    throw new NotFoundError("product", productId);
  }
  if (existing.userId !== userId) {
    throw new ForbiddenError("작성자만 수정/삭제할 수 있습니다.");
  }

  return existing;
}

export type CreateProductInput = z.infer<typeof CreateProduct>;

export async function createProductService(
  userId: number,
  input: CreateProductInput
): Promise<ProductBaseDto> {
  const entity = await productRepo.createProduct(userId, input);
  return toProductBaseDto(entity);
}

export async function getProductService(
  id: number,
  userId: number | null
): Promise<ProductDetailDto> {
  const product = (await productRepo.findProductById(
    id,
    userId
  )) as ProductEntityWithLikes | null;
  if (!product) {
    throw new NotFoundError(`product (ID: ${id}) not found`);
  }
  const isLiked = userId ? (product.likes?.length ?? 0) > 0 : false;

  return toProductDetailDto(product, isLiked);
}

export type UpdateProductInput = z.infer<typeof UpdateProduct>;

export async function updateProductService(
  productId: number,
  userId: number,
  input: UpdateProductInput
): Promise<ProductBaseDto> {
  const existing = await productRepo.findProductOwner(productId);
  if (!existing) throw new NotFoundError("product", productId);
  if (existing.userId !== userId) {
    throw new ForbiddenError("작성자만 수정할 수 있습니다.");
  }
  const updated = await productRepo.updateProduct(productId, input);

  return toProductBaseDto(updated);
}

export async function deleteProductService(
  productId: number,
  userId: number
): Promise<void> {
  await requireProductOwner(productId, userId);
  await productRepo.deleteProduct(productId);
}

export type GetProductListQuery = z.infer<typeof GetProductList>;
export type ProductListResponse = {
  list: ProductBaseDto[];
  totalCount: number;
};
export async function getProductListService(
  query: GetProductListQuery
): Promise<ProductListResponse> {
  const { page, pageSize, orderBy, keyword } = query;

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;

  const [totalCount, products] = await productRepo.findProductList({
    page,
    pageSize,
    orderBy,
    where,
    search,
  });

  return {
    list: toProductBaseDtoList(products),
    totalCount,
  };
}
export type CreateCommentBody = z.infer<typeof CreateComment>;

export async function createProductCommentService(
  userId: number,
  productId: number,
  body: CreateCommentBody
): Promise<CommentDto> {
  const exists = await productRepo.existsProduct(productId);
  if (!exists) throw new NotFoundError("product", productId);

  const entity = await commentRepo.createComment({
    content: body.content,
    userId,
    productId,
  });

  return toCommentDto(entity);
}

export async function likeProductService(userId: number, productId: number) {
  const product = await productRepo.findProductOwner(productId);
  if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");

  try {
    await productRepo.createProductLike(userId, productId);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw new ConflictError("이미 좋아요한 상품입니다.");
    }
    throw e;
  }
}

export async function unlikeProductService(userId: number, productId: number) {
  const product = await productRepo.findProductOwner(productId);
  if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");

  try {
    await productRepo.deleteProductLike(userId, productId);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      throw new ConflictError("좋아요하지 않은 상품입니다.");
    }
    throw e;
  }
}

export async function getProductCommentList({
  productId,
  cursor,
  limit,
}: {
  productId: number;
  cursor: number | null;
  limit: number;
}) {
  const product = await productRepo.findProductOwner(productId);
  if (!product) throw new NotFoundError("product", productId);

  const fetched = await productRepo.findProductComments({
    productId,
    cursor,
    take: limit + 1,
  });

  const hasNext = fetched.length > limit;
  const list = fetched.slice(0, limit);
  const nextCursor = hasNext ? list[list.length - 1].id : null;

  return { list, nextCursor };
}
