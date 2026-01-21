import { z } from 'zod';
import { pageParamsSchema } from './commonSchemas.js';

export const createArticleSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().nullable().optional(),
});

export const updateArticleSchema = createArticleSchema.partial();

export const getArticleListParamsSchema = pageParamsSchema;

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type GetArticleListParams = z.infer<typeof getArticleListParamsSchema>;
