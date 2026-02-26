import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import * as productsRepository from '../repositories/productsRepository';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import Product from '../types/Product';
import * as favoritesRepository from '../repositories/favoritesRepository'; // 추가
import * as notificationsService from './notificationsService';
import { NotificationType } from '@prisma/client';

type CreateProductData = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'favoriteCount' | 'isFavorited'
>;
type UpdateProductData = Partial<CreateProductData> & { userId: number };

export async function createProduct(data: CreateProductData): Promise<Product> {
  const createdProduct = await productsRepository.createProduct(data);
  return {
    ...createdProduct,
    favoriteCount: 0,
    isFavorited: false,
  };
}

export async function getProduct(id: number): Promise<Product | null> {
  const product = await productsRepository.getProductWithFavorites(id);
  if (!product) {
    throw new NotFoundError('product', id);
  }
  return product;
}

export async function getProductList(
  params: PagePaginationParams,
  { userId }: { userId?: number } = {},
): Promise<PagePaginationResult<Product>> {
  const products = await productsRepository.getProductListWithFavorites(params, { userId });
  return products;
}

export async function updateProduct(
  id: number,
  userId: number,
  data: UpdateProductData,
): Promise<Product> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  const updatedProduct = await productsRepository.updateProductWithFavorites(id, data);
  if (data.price !== undefined && existingProduct.price !== updatedProduct.price) {
    const fanUserIds = await favoritesRepository.getFavoriteUserIdsByProductId(id);

    const message = `[가격 변동] 찜하신 상품 '${updatedProduct.name}'의 가격이 ${existingProduct.price}원에서 ${updatedProduct.price}원으로 변경되었습니다!`;

    fanUserIds.forEach((targetUserId) => {
      if (targetUserId !== userId) {
        notificationsService
          .sendNotification({
            userId: targetUserId,
            type: NotificationType.PRICE_CHANGE,
            content: message,
            productId: id,
          })
          .catch((err) =>
            console.error(`Failed to send price alert to user ${targetUserId}:`, err),
          );
      }
    });
  }
  return updatedProduct;
}

export async function deleteProduct(id: number, userId: number): Promise<void> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  await productsRepository.deleteProduct(id);
}
