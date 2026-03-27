import { User, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({ data });
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
  return prisma.user.update({ where: { id }, data });
}

export async function updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
  await prisma.user.update({ where: { id }, data: { refreshToken } });
}
