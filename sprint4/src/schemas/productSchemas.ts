import { z } from 'zod';
import { pageParamsSchema } from './commonSchemas.js';

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().int().min(0, 'Price must be non-negative'),
  tags: z.array(z.string().min(1)),
  images: z.array(z.string().min(1)),
});

export const updateProductSchema = createProductSchema.partial();

export const getProductListParamsSchema = pageParamsSchema;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductListParams = z.infer<typeof getProductListParamsSchema>;
