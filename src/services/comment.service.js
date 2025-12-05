import { prisma } from "../../prisma/prisma.js";
import CustomError from "../utils/CustomError.js";
import {
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
  orderByToSort,
} from "../utils/continuation-token.js";

const DEFAULT_ORDER_BY = [{ createdAt: "desc" }, { id: "asc" }];

class CommentService {
  constructor() {
    this.prisma = prisma;
  }
  async createProductComment(productId, content) {
    let bigIntId;
    try {
      bigIntId = BigInt(productId);
    } catch (error) {
      throw new CustomError("상품 ID가 잘못되었습니다.", 404);
    }
    const product = await this.prisma.product.findUnique({
      where: { id: bigIntId },
    });
    if (!product) throw new CustomError("상품을 찾을 수 없습니다.", 404);
    return this.prisma.comment.create({
      data: {
        content,
        productId: bigIntId,
      },
    });
  }

  async createArticleComment(articleId, content) {
    let bigIntId;
    try {
      bigIntId = BigInt(articleId);
    } catch (error) {
      throw new CustomError("게시글 ID가 잘못되었습니다.", 404);
    }
    const article = await this.prisma.article.findUnique({
      where: { id: bigIntId },
    });
    if (!article) throw new CustomError("게시글을 찾을 수 없습니다.", 404);
    return this.prisma.comment.create({
      data: {
        content,
        articleId: bigIntId,
      },
    });
  }

  async patchComment(commentId, content) {
    let bigIntId;
    try {
      bigIntId = BigInt(commentId);
    } catch (error) {
      throw new CustomError("유효하지 않은 아이디입니다.", 400);
    }
    try {
      return this.prisma.comment.update({
        where: { id: bigIntId },
        data: {
          content,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new CustomError("댓글을 찾을 수 없습니다.", 404);
      }
      throw new CustomError("댓글 수정 중 오류가 발생했습니다.", 500);
    }
  }
  async deleteComment(commentId) {
    let bigIntId;
    try {
      bigIntId = BigInt(commentId);
    } catch (error) {
      throw new CustomError("유효하지 않은 ID입니다.", 400);
    }
    try {
      return this.prisma.comment.delete({
        where: { id: bigIntId },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new CustomError("댓글을 찾을 수 없습니다.", 404);
      }
      throw new CustomError("댓글 삭제 중 오류가 발생했습니다.", 500);
    }
  }
  /**
   * @param {string} productId
   * @param {number} limit
   * @param {string} token
   * @returns {Object}
   */
  async getProductComments(productId, limit, token) {
    let bigIntId;
    try {
      bigIntId = BigInt(productId);
    } catch (error) {
      throw new CustomError("상품 ID가 잘못되었습니다.", 404);
    }

    const parsedToken = parseContinuationToken(token);
    const sortFormat = orderByToSort(DEFAULT_ORDER_BY);
    const cursorWhere = buildCursorWhere(parsedToken?.data, sortFormat);
    const comments = await this.prisma.comment.findMany({
      where: {
        productId: bigIntId,
        ...cursorWhere,
      },
      take: limit + 1,
      orderBy: DEFAULT_ORDER_BY,
    });

    let nextToken = null;
    const hasNextPage = comments.length > limit;
    if (hasNextPage) {
      const nextCursorItem = comments.pop();
      nextToken = createContinuationToken(nextCursorItem, sortFormat);
    }
    return {
      comments,
      nextToken,
    };
  }
  /**
   * @param {string} articleId
   * @param {number} limit
   * @param {string} token
   * @returns {Object}
   */
  async getArticleComments(articleId, limit, token) {
    let bigIntId;
    try {
      bigIntId = BigInt(articleId);
    } catch (error) {
      throw new CustomError("게시글 ID가 잘못되었습니다.", 404);
    }

    const parsedToken = parseContinuationToken(token);
    const sortFormat = orderByToSort(DEFAULT_ORDER_BY);
    const cursorWhere = buildCursorWhere(parsedToken?.data, sortFormat);
    const comments = await this.prisma.comment.findMany({
      where: {
        articleId: bigIntId,
        ...cursorWhere,
      },
      take: limit + 1,
      orderBy: DEFAULT_ORDER_BY,
    });

    let nextToken = null;
    const hasNextPage = comments.length > limit;
    if (hasNextPage) {
      const nextCursorItem = comments.pop();
      nextToken = createContinuationToken(nextCursorItem, sortFormat);
    }

    return { comments, nextToken };
  }
}

export default new CommentService();
