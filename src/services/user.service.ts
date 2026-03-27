import bcrypt from 'bcrypt';
import * as userRepo from '../repositories/user.repository';
import * as productRepo from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';
import { toUserDto, UserResponseDto } from '../dtos/user.dto';
import { toProductDto } from '../dtos/product.dto';
import { getOffsetPaginationParams, buildOffsetResult } from '../utils/pagination';
import { BCRYPT_ROUNDS } from '../config/env';

export async function getMe(userId: number): Promise<UserResponseDto> {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return toUserDto(user);
}

export async function updateMe(userId: number, data: { nickname?: string; image?: string }) {
  const user = await userRepo.updateUser(userId, data);
  return toUserDto(user);
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new ApiError(400, 'Current password is incorrect');

  const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await userRepo.updateUser(userId, { password: hashed });
}

export async function getMyProducts(userId: number, page: number, pageSize: number) {
  const { skip, take } = getOffsetPaginationParams({ page, pageSize });
  const { data, total } = await productRepo.findUserProducts(userId, { skip, take });
  const dtos = data.map((p) => toProductDto(p, false));
  return buildOffsetResult(dtos, total, { page, pageSize });
}

export async function getMyLikedProducts(userId: number, page: number, pageSize: number) {
  const { skip, take } = getOffsetPaginationParams({ page, pageSize });
  const { data, total } = await productRepo.findLikedProducts(userId, { skip, take });
  const dtos = data.map((p) => toProductDto(p, true));
  return buildOffsetResult(dtos, total, { page, pageSize });
}
