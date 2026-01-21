import { z } from 'zod';

// Common helper for coercing string to integer
export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const pageParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  orderBy: z.enum(['recent', 'oldest']).optional(),
  keyword: z.string().trim().min(1).optional(),
});

export const cursorParamsSchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().default(10),
});

export type IdParams = z.infer<typeof idParamsSchema>;
export type PageParams = z.infer<typeof pageParamsSchema>;
export type CursorParams = z.infer<typeof cursorParamsSchema>;
