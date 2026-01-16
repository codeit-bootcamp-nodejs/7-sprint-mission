import { productRepository } from '../repositories/productsRepository.js';
import { commentRepository } from '../repositories/commentsRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export const productService = {
  async getProduct(id: number, userId?: number) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('product', id);

    return {
      ...product,
      favorites: undefined,
      favoriteCount: product.favorites.length,
      isFavorited: userId ? product.favorites.some((f) => f.userId === userId) : undefined,
    };
  },

  async getProductList(query: any, userId?: number) {
    const { page, pageSize, orderBy, keyword } = query;
    const where = keyword
      ? {
          OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
        }
      : undefined;

    const totalCount = await productRepository.count(where);
    const products = await productRepository.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
      where,
    });

    const list = products.map((p) => ({
      ...p,
      favorites: undefined,
      favoriteCount: p.favorites.length,
      isFavorited: userId ? p.favorites.some((f) => f.userId === userId) : undefined,
    }));

    return { list, totalCount };
  },

  async updateProduct(id: number, userId: number, data: any) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('product', id);
    if (product.userId !== userId) throw new ForbiddenError('Should be owner');

    return await productRepository.update(id, data);
  },

  async deleteProduct(id: number, userId: number) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('product', id);
    if (product.userId !== userId) throw new ForbiddenError('Should be owner');

    await productRepository.delete(id);
  },

  async toggleFavorite(productId: number, userId: number, isCreate: boolean) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('product', productId);

    const existing = await productRepository.findFavorite(productId, userId);
    if (isCreate) {
      if (existing) throw new BadRequestError('Already favorited');
      await productRepository.createFavorite(productId, userId);
    } else {
      if (!existing) throw new BadRequestError('Not favorited');
      await productRepository.deleteFavorite(existing.id);
    }
  },

  // 댓글 관련
  async createComment(productId: number, userId: number, content: string) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('product', productId);
    return await commentRepository.create({ productId, userId, content });
  },

  async getCommentList(productId: number, query: any) {
    const { cursor, limit } = query;
    const commentsWithCursor = await commentRepository.findManyByArticleId(productId, {
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      where: { productId },
    });
  },
};
