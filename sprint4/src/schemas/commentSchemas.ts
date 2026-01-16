import { z } from 'zod';
import { cursorParamsSchema } from './commonSchemas.js';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

export const updateCommentSchema = createCommentSchema.partial();

export const getCommentListParamsSchema = cursorParamsSchema;

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type GetCommentListParams = z.infer<typeof getCommentListParamsSchema>;
