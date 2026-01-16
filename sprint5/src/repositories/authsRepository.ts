import { prismaClient } from '../lib/prismaClient.js';

export const userRepository = {
  async findByEmail(email: string) {
    return await prismaClient.user.findUnique({ where: { email } });
  },

  async findById(id: number) {
    return await prismaClient.user.findUnique({ where: { id } });
  },

  async create(data: any) {
    return await prismaClient.user.create({ data });
  },
};
