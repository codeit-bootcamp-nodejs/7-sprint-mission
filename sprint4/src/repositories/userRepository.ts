import { PrismaClient, User } from '@prisma/client';
import { UserCreateData } from '../dtos/authDtos.js';
import { UserUpdateData } from '../dtos/userDtos.js';
import { IUserRepository } from './interfaces/IUserRepository.js';

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: UserCreateData): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: UserUpdateData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword(id: number, hashedPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }
}
