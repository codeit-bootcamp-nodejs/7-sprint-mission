import * as productRepository from '../repositories/productRepository';
import { toProductDto } from '../dto/productDto';
import { sendPriceChangedNotification } from './notificationService';

export async function getProducts(params: {
  orderBy?: string;
  page?: number;
  pageSize?: number;
  keyword?: string;
}) {
  const orderBy = (params.orderBy === 'favorite' ? 'favorite' : 'recent') as
    | 'recent'
    | 'favorite';
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  const { products, totalCount } = await productRepository.findProducts({
    orderBy,
    page,
    pageSize,
    keyword: params.keyword,
  });

  return { list: products.map(toProductDto), totalCount };
}

export async function getProduct(id: number) {
  const product = await productRepository.findProductById(id);
  if (!product) {
    const error = new Error('상품을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  return toProductDto(product);
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
}) {
  const product = await productRepository.createProduct(data);
  return toProductDto(product);
}

export async function updateProduct(
  id: number,
  userId: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    images?: string[];
  }
) {
  const product = await productRepository.findProductById(id);
  if (!product) {
    const error = new Error('상품을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  if (product.userId !== userId) {
    const error = new Error('권한이 없습니다');
    (error as any).status = 403;
    throw error;
  }

  const oldPrice = product.price;
  const updated = await productRepository.updateProduct(id, data);

  if (data.price !== undefined && data.price !== oldPrice) {
    const favoriteUsers = await productRepository.findFavoriteUsersByProductId(id);
    const userIds = favoriteUsers.map((f) => f.userId);
    if (userIds.length > 0) {
      sendPriceChangedNotification(
        {
          productId: id,
          productName: updated.name,
          oldPrice,
          newPrice: data.price,
        },
        userIds
      ).catch(console.error);
    }
  }

  return toProductDto(updated);
}

export async function deleteProduct(id: number, userId: number) {
  const product = await productRepository.findProductById(id);
  if (!product) {
    const error = new Error('상품을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  if (product.userId !== userId) {
    const error = new Error('권한이 없습니다');
    (error as any).status = 403;
    throw error;
  }
  await productRepository.deleteProduct(id);
}

export async function favoriteProduct(productId: number, userId: number) {
  const product = await productRepository.findProductById(productId);
  if (!product) {
    const error = new Error('상품을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  const existing = await productRepository.findFavorite(productId, userId);
  if (existing) {
    const error = new Error('이미 찜한 상품입니다');
    (error as any).status = 409;
    throw error;
  }
  await productRepository.createFavorite(productId, userId);
  const updated = await productRepository.findProductById(productId);
  return toProductDto(updated!);
}

export async function unfavoriteProduct(productId: number, userId: number) {
  const product = await productRepository.findProductById(productId);
  if (!product) {
    const error = new Error('상품을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  await productRepository.deleteFavorite(productId, userId);
  const updated = await productRepository.findProductById(productId);
  return toProductDto(updated!);
}
