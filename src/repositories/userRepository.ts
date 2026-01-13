import { prisma } from '../lib/prismaClient';
import { RegisterBody } from '../structs/authStruct';

export const userRepository = {
  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  async create(data: RegisterBody & { password: string }) {
    return prisma.user.create({ data });
  },
  async update(id: number, data: any) {
    return prisma.user.update({ where: { id }, data });
  }
};