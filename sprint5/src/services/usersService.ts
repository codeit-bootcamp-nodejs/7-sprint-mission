import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/usersRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';

export const userService = {
  async getUserInfo(id: number) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('user', id);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updateUserInfo(id: number, data: any) {
    const updatedUser = await userRepository.update(id, data);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async updatePassword(id: number, data: any) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('user', id);

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid credentials');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);

    await userRepository.update(id, { password: hashedPassword });
  },

  async getMyProducts(userId: number, query: any) {
    const { page, pageSize, orderBy, keyword } = query;
    const searchWhere = keyword
      ? {
          OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
        }
      : {};

    const where = { ...searchWhere, userId };

    const totalCount = await userRepository.countProducts(where);
    const products = await userRepository.findMyProducts({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
      where,
    });

    // DTO
    const list = products.map((product) => ({
      ...product,
      favorites: undefined,
      favoriteCount: product.favorites.length,
      isFavorited: product.favorites.some((f) => f.userId === userId),
    }));

    return { list, totalCount };
  },

  async getMyFavorites(userId: number, query: any) {
    const { page, pageSize, orderBy, keyword } = query;
    const searchWhere = keyword
      ? {
          OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
        }
      : {};

    const where = { ...searchWhere, favorites: { some: { userId } } };

    const totalCount = await userRepository.countProducts(where);
    const products = await userRepository.findMyProducts({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
      where,
    });

    const list = products.map((product) => ({
      ...product,
      favorites: undefined,
      favoriteCount: product.favorites.length,
      isFavorited: true, // 찜 목록이니까 true
    }));

    return { list, totalCount };
  },
};
