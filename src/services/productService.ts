import type {
  CreateProductDto,
  UpdateProductDto,
  GetProductDto,
  DeleteProductDto,
  ListProductsDto,
  CreateProductCommentDto,
  ListProductCommentsCursorDto,
} from "../dtos/product.dto.js";

import * as productRepository from "../repositories/product.repository.js";

export const createProduct = async (dto: CreateProductDto) => {
  return productRepository.createProduct(dto);
};

export const getProductById = async (dto: GetProductDto) => {
  return productRepository.findProductById(dto);
};

export const updateProduct = async (dto: UpdateProductDto) => {
  const { id, ...data } = dto;
  return productRepository.updateProductById({ id, data });
};

export const deleteProduct = async (dto: DeleteProductDto) => {
  return productRepository.deleteProductById(dto.id);
};

export const listProducts = async (dto: ListProductsDto) => {
  const take = dto.limit ?? 3;
  const skip = dto.offset ?? 0;

  return productRepository.findProducts({
    take,
    skip,
    sort: dto.sort,
    search: dto.search,
    userId: dto.userId,
  });
};

export const createProductComment = async (dto: CreateProductCommentDto) => {
  return productRepository.createProductComment(dto);
};

export const listProductCommentsCursor = async (dto: ListProductCommentsCursorDto) => {
  const take = dto.limit ?? 10;

  return productRepository.findProductCommentsCursor({
    productId: dto.productId,
    take,
    cursorId: dto.cursorId,
  });
};
