import { PrismaClient, Product } from '@prisma/client';
import { ProductCreateData, ProductUpdateData } from '../dtos/productDtos.js';
import { IProductRepository } from './interfaces/IProductRepository.js';

export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: ProductCreateData & { userId: number }): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async findById(id: number, includeRelations = false) {
    return this.prisma.product.findUnique({
      where: { id },
      include: includeRelations ? { favorites: true } : undefined,
    });
  }

  async findMany(params: {
    skip: number;
    take: number;
    orderBy: 'desc' | 'asc';
    keyword?: string;
    includeRelations?: boolean;
  }) {
    const where = params.keyword
      ? {
          OR: [
            { name: { contains: params.keyword } },
            { description: { contains: params.keyword } },
          ],
        }
      : undefined;

    return this.prisma.product.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { id: params.orderBy },
      where,
      include: params.includeRelations ? { favorites: true } : undefined,
    });
  }

  async findManyByUserId(userId: number, params: {
    skip: number;
    take: number;
    orderBy: 'desc' | 'asc';
    keyword?: string;
  }) {
    const where = {
      userId,
      ...(params.keyword
        ? {
            OR: [
              { name: { contains: params.keyword } },
              { description: { contains: params.keyword } },
            ],
          }
        : {}),
    };

    return this.prisma.product.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { id: params.orderBy },
      where,
      include: { favorites: true },
    });
  }

  async count(keyword?: string): Promise<number> {
    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
      : undefined;

    return this.prisma.product.count({ where });
  }

  async countByUserId(userId: number, keyword?: string): Promise<number> {
    const where = {
      userId,
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword } },
              { description: { contains: keyword } },
            ],
          }
        : {}),
    };

    return this.prisma.product.count({ where });
  }

  async update(id: number, data: ProductUpdateData): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
