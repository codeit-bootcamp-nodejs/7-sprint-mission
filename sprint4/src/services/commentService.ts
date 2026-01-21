import { Comment } from '@prisma/client';
import { ICommentRepository } from '../repositories/interfaces/ICommentRepository.js';
import { IProductRepository } from '../repositories/interfaces/IProductRepository.js';
import { IArticleRepository } from '../repositories/interfaces/IArticleRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { CommentListResponse } from '../dtos/commentDtos.js';
import { CreateCommentInput } from '../schemas/commentSchemas.js';

export class CommentService {
  constructor(
    private commentRepository: ICommentRepository,
    private productRepository: IProductRepository,
    private articleRepository: IArticleRepository
  ) {}

  async createProductComment(
    productId: number,
    userId: number,
    data: CreateCommentInput
  ): Promise<Comment> {
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw new NotFoundError('product', productId);
    }

    return this.commentRepository.create({
      productId,
      articleId: null,
      content: data.content,
      userId,
    });
  }

  async getProductComments(
    productId: number,
    cursor?: number,
    limit: number = 10
  ): Promise<CommentListResponse> {
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw new NotFoundError('product', productId);
    }

    const commentsWithCursor = await this.commentRepository.findManyByProductId({
      productId,
      cursor,
      limit: limit + 1,
    });

    const comments = commentsWithCursor.slice(0, limit);
    const nextCursor = commentsWithCursor.length > limit 
      ? commentsWithCursor[limit - 1].id 
      : null;

    return {
      list: comments,
      nextCursor,
    };
  }

  async createArticleComment(
    articleId: number,
    userId: number,
    data: CreateCommentInput
  ): Promise<Comment> {
    const article = await this.articleRepository.findById(articleId);
    
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    return this.commentRepository.create({
      productId: null,
      articleId,
      content: data.content,
      userId,
    });
  }

  async getArticleComments(
    articleId: number,
    cursor?: number,
    limit: number = 10
  ): Promise<CommentListResponse> {
    const article = await this.articleRepository.findById(articleId);
    
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    const commentsWithCursor = await this.commentRepository.findManyByArticleId({
      articleId,
      cursor,
      limit: limit + 1,
    });

    const comments = commentsWithCursor.slice(0, limit);
    const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
    const nextCursor = cursorComment ? cursorComment.id : null;

    return {
      list: comments,
      nextCursor,
    };
  }
}
