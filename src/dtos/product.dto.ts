export type ProductSort = "recent";

export type CreateProductDto = {
  userId: bigint;
  name: string;
  price: number;
  description?: string;
  tags: string[];
};

export type UpdateProductDto = {
  id: bigint;
  name?: string;
  price?: number;
  description?: string;
  tags?: string[];
};

export type GetProductDto = {
  id: bigint;
  userId: bigint | null;
};

export type DeleteProductDto = {
  id: bigint;
};

export type ListProductsDto = {
  limit?: number;
  offset?: number;
  sort?: ProductSort;
  search?: string;
  userId: bigint | null;
};

export type CreateProductCommentDto = {
  userId: bigint;
  productId: bigint;
  content: string;
};

export type ListProductCommentsCursorDto = {
  productId: bigint;
  limit?: number;
  cursorId?: bigint;
};
