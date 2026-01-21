import type { ParamsDictionary } from 'express-serve-static-core';

export interface ProductParams extends ParamsDictionary {
  productId: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
}
