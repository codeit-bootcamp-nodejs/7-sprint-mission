import { productRepository } from '../repositories/productRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { CreateProductBody, UpdateProductBody } from '../structs/productsStruct';
import { User } from '@prisma/client';
import { notificationService } from './notificationService';

export const productService = {
  async getProduct(id: number, user?: User) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('product', id);

    let isLiked = false;
    if (user) {
      const like = await productRepository.findLike(user.id, id);
      isLiked = !!like;
    }
    return { ...product, isLiked };
  },

  async getList(page: number, pageSize: number, orderBy: 'recent' | undefined, keyword?: string) {
    const skip = (page - 1) * pageSize;
    const [list, totalCount] = await Promise.all([
      productRepository.findList(skip, pageSize, orderBy, keyword),
      productRepository.count(keyword),
    ]);
    return { list, totalCount };
  },

  async createProduct(userId: number, data: CreateProductBody) {
    return productRepository.create(userId, data);
  },

  async updateProduct(userId: number, productId: number, data: UpdateProductBody) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('product', productId);

    if (product.userId !== userId) {
      throw new ForbiddenError('You are not allowed to update this product');
    }

    if (data.price !== undefined && data.price !== product.price) {
      const likers = await productRepository.findLikers(productId);
      const content = `${product.name}의 가격이 ${product.price}원에서 ${data.price}원으로 변경되었습니다.`;

      Promise.all(
        likers.map((liker) =>
          notificationService.createAndSend(liker.userId, content, 'PRICE_CHANGE', productId)
        )
      ).catch(err => console.error('가격 변동 알림 전송 실패', err));
    }
    return productRepository.update(productId, data);
  },

  async deleteProduct(userId: number, productId: number) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('product', productId);

    if (product.userId !== userId) {
      throw new ForbiddenError('You are not allowed to delete this product');
    }
    return productRepository.delete(productId);
  },

  async toggleLike(userId: number, productId: number) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('product', productId);

    const existingLike = await productRepository.findLike(userId, productId);
    if (existingLike) {
      await productRepository.removeLike(existingLike.id);
      return { isLiked: false };
    } else {
      await productRepository.addLike(userId, productId);
      return { isLiked: true };
    }
  },
};