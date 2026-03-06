import { User } from '@prisma/client';

export function toUserDto(user: User) {
  const { password, ...rest } = user;
  return rest;
}
