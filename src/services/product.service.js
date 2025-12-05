import { prisma } from "../../prisma/prisma.js";
import CustomError from "../utils/CustomError.js";

class ProductService {
  constructor() {
    this.prisma = prisma;
  }

  async createProduct(data) {
    return this.prisma.product.create({ data });
  }

  async getProductList({ offset, limit, sort, search }) {
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    const orderBy = {};
    if (sort === "recent") {
      orderBy.createdAt = "desc";
    }

    const products = await this.prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy,
      where,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
    const totalCount = await this.prisma.product.count({ where });
    return { products, totalCount: totalCount.toString() };
  }

  async getProductById(id) {
    let bigIntId;
    try {
      bigIntId = BigInt(id);
    } catch (error) {
      throw new CustomError("유효하지않은 ID입니다.", 400);
    }
    return this.prisma.product.findUnique({
      where: { id: bigIntId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async patchProduct(id, data) {
    let bigIntId;
    try {
      bigIntId = BigInt(id);
    } catch (error) {
      throw new CustomError("상품을 찾을 수 없습니다.", 404);
    }
    return this.prisma.product.update({
      where: { id: bigIntId },
      data,
    });
  }

  async deleteProduct(id) {
    let bigIntId;
    try {
      bigIntId = BigInt(id);
    } catch (error) {
      throw new CustomError("상품을 찾을 수 없습니다.", 404);
    }
    return this.prisma.product.delete({
      where: { id: bigIntId },
    });
  }
}

export default new ProductService();
