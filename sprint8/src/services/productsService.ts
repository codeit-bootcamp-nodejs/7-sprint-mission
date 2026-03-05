import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import * as productsRepository from '../repositories/productsRepository';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import Product from '../types/Product';

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
    throw new NotFoundError('해당 상품이 존재하지 않습니다.');
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

export async function updateProduct(id: number, data: UpdateProductData): Promise<Product> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('해당 상품이 존재하지 않습니다.');
  }
  if (existingProduct.userId !== data.userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  const updatedProduct = await productsRepository.updateProductWithFavorites(id, data);
  return updatedProduct;
}

export async function deleteProduct(id: number, userId: number): Promise<void> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('해당 상품이 존재하지 않습니다.');
  }
  if (existingProduct.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  await productsRepository.deleteProduct(id);
}
