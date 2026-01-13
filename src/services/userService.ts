import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository';
import { productRepository } from '../repositories/productRepository';
import { UpdateUserBody, UpdatePasswordBody } from '../structs/userStruct';
import BadRequestError from '../lib/errors/BadRequestError';

export const userService = {
  async updateUser(userId: number, data: UpdateUserBody) {
    const updatedUser = await userRepository.update(userId, data);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async updatePassword(userId: number, currentPassword: string, data: UpdatePasswordBody, userPasswordHash: string) {
    const isPasswordValid = await bcrypt.compare(data.oldPassword, userPasswordHash);
    if (!isPasswordValid) throw new BadRequestError('비밀번호가 일치하지 않습니다.');

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await userRepository.update(userId, { password: hashedPassword });
  },

  async getMyProducts(userId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [list, totalCount] = await Promise.all([
      productRepository.findList(skip, pageSize, 'recent', undefined, userId),
      productRepository.count(undefined, userId),
    ]);
    return { list, totalCount };
  },

  async getLikedProducts(userId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [list, totalCount] = await Promise.all([
      productRepository.findList(skip, pageSize, 'recent', undefined, userId, true),
      productRepository.count(undefined, userId, true),
    ]);
    return { list, totalCount };
  },
};