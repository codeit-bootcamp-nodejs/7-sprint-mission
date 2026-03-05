import * as favoritesRepository from '../repositories/favoritesRepository';
import * as productsRepository from '../repositories/productsRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import BadRequestError from '../lib/errors/BadRequestError';

export async function createFavorite(productId: number, userId: number) {
  const existingProduct = await productsRepository.getProduct(productId);
  if (!existingProduct) {
    throw new NotFoundError('해당 상품이 존재하지 않습니다.');
  }

  const existingFavorite = await favoritesRepository.getFavorite(productId, userId);
  if (existingFavorite) {
    throw new BadRequestError('이미 즐겨찾기에 추가된 상품입니다.');
  }

  await favoritesRepository.createFavorite({ productId, userId });
}

export async function deleteFavorite(productId: number, userId: number) {
  const existingProduct = await productsRepository.getProduct(productId);
  if (!existingProduct) {
    throw new NotFoundError('해당 상품이 존재하지 않습니다.');
  }

  const existingFavorite = await favoritesRepository.getFavorite(productId, userId);
  if (!existingFavorite) {
    throw new BadRequestError('즐겨찾기에 추가되지 않은 상품입니다.');
  }

  await favoritesRepository.deleteFavorite(existingFavorite.id);
}
