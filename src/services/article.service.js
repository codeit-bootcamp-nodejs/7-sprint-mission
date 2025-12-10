import { prisma } from "../../prisma/prisma.js";
import CustomError from "../utils/CustomError.js";

class ArticleService {
  constructor() {
    this.prisma = prisma;
  }

  async createArticle(data) {
    return this.prisma.article.create({ data });
  }

  async getArticleList({ offset, limit, sort, search }) {
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }
    const orderBy = {};
    if (sort === "recent") {
      orderBy.createdAt = "desc";
    }
    const articles = await this.prisma.article.findMany({
      skip: offset,
      take: limit,
      orderBy,
      where,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    const totalCount = await this.prisma.article.count({ where });
    return { articles, totalCount: totalCount.toString() };
  }

  async getArticleById(id) {
    let bigIntId;
    try {
      bigIntId = BigInt(id);
    } catch (error) {
      throw new CustomError("유효하지않은 ID입니다.", 400);
    }
    return this.prisma.article.findUnique({
      where: { id: bigIntId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async patchArticle(id, data) {
    let bigIntId;
    try {
      bigIntId = BigInt(id);
    } catch (error) {
      throw new CustomError("게시글을 찾을 수 없습니다.", 404);
    }
    return this.prisma.article.update({
      where: { id: bigIntId },
      data,
    });
  }

  async deleteArticle(id) {
    let bigIntId;
    try {
      bigIntId = BigInt(id);
    } catch (error) {
      throw new CustomError("게시글을 찾을 수 없습니다.", 404);
    }
    return this.prisma.article.delete({
      where: { id: bigIntId },
    });
  }
}

export default new ArticleService();
