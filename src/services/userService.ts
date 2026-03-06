import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository';
import { toUserDto } from '../dto/userDto';
import { toProductDto } from '../dto/productDto';

export async function getMe(userId: number) {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    const error = new Error('사용자를 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  return toUserDto(user);
}

export async function updateMe(userId: number, data: { nickname?: string; image?: string }) {
  const user = await userRepository.updateUser(userId, data);
  return toUserDto(user);
}

export async function updatePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    const error = new Error('사용자를 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    const error = new Error('현재 비밀번호가 올바르지 않습니다');
    (error as any).status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updated = await userRepository.updateUser(userId, { password: hashedPassword });
  return toUserDto(updated);
}

export async function getMyProducts(params: {
  userId: number;
  page: number;
  pageSize: number;
}) {
  const { products, totalCount } = await userRepository.findProductsByUserId(params);
  return {
    list: products.map(toProductDto),
    totalCount,
  };
}

export async function getMyFavorites(params: {
  userId: number;
  page: number;
  pageSize: number;
}) {
  const { favorites, totalCount } = await userRepository.findFavoritesByUserId(params);
  return {
    list: favorites.map((f) => toProductDto(f.product)),
    totalCount,
  };
}
