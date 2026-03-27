import * as productRepo from '../repositories/product.repository';
import * as likeRepo from '../repositories/like.repository';
import { ApiError } from '../utils/ApiError';
import { toProductDto } from '../dtos/product.dto';
import { getOffsetPaginationParams, buildOffsetResult } from '../utils/pagination';

export async function getProducts(params: {
  page: number;
  pageSize: number;
  keyword?: string;
  userId?: number;
}) {
  const { skip, take } = getOffsetPaginationParams({ page: params.page, pageSize: params.pageSize });
  const { data, total } = await productRepo.findProducts({ skip, take, keyword: params.keyword });

  const likedSet = params.userId
    ? await likeRepo.findProductLikesByUser(params.userId, data.map((p) => p.id))
    : new Set<number>();

  const dtos = data.map((p) => toProductDto(p, likedSet.has(p.id)));
  return buildOffsetResult(dtos, total, { page: params.page, pageSize: params.pageSize });
}

export async function getProduct(id: number, userId?: number) {
  const product = await productRepo.findProductById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  const isLiked = userId ? !!(await likeRepo.findProductLike(userId, id)) : false;
  return toProductDto(product, isLiked);
}

export async function createProduct(
  data: { name: string; description: string; price: number; tags?: string[]; images?: string[] },
  authorId: number
) {
  const product = await productRepo.createProduct({
    name: data.name,
    description: data.description,
    price: data.price,
    tags: data.tags ?? [],
    images: data.images ?? [],
    author: { connect: { id: authorId } },
  });
  return toProductDto(product, false);
}

export async function updateProduct(
  id: number,
  data: { name?: string; description?: string; price?: number; tags?: string[]; images?: string[] },
  userId: number
) {
  const product = await productRepo.findProductById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.authorId !== userId) throw new ApiError(403, 'Forbidden');
  const [updated, isLiked] = await Promise.all([
    productRepo.updateProduct(id, data),
    likeRepo.findProductLike(userId, id),
  ]);
  return toProductDto(updated, !!isLiked);
}

export async function deleteProduct(id: number, userId: number) {
  const product = await productRepo.findProductById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.authorId !== userId) throw new ApiError(403, 'Forbidden');
  await productRepo.deleteProduct(id);
}

export async function likeProduct(productId: number, userId: number) {
  const product = await productRepo.findProductById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  const existing = await likeRepo.findProductLike(userId, productId);
  if (existing) throw new ApiError(409, 'Already liked');
  await likeRepo.createProductLike(userId, productId);
  const updated = await productRepo.findProductById(productId);
  return toProductDto(updated!, true);
}

export async function unlikeProduct(productId: number, userId: number) {
  const product = await productRepo.findProductById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  const existing = await likeRepo.findProductLike(userId, productId);
  if (!existing) throw new ApiError(404, 'Like not found');
  await likeRepo.deleteProductLike(userId, productId);
  const updated = await productRepo.findProductById(productId);
  return toProductDto(updated!, false);
}
