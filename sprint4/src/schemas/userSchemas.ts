import { z } from 'zod';
import { pageParamsSchema } from './commonSchemas.js';

export const updateMeSchema = z.object({
  email: z.email().optional(),
  nickname: z.string().optional(),
  image: z.string().nullable().optional(),
}).partial();

export const updatePasswordSchema = z.object({
  password: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(1, 'New password is required'),
});

export const getMyProductListParamsSchema = pageParamsSchema;
export const getMyFavoriteListParamsSchema = pageParamsSchema;

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type GetMyProductListParams = z.infer<typeof getMyProductListParamsSchema>;
export type GetMyFavoriteListParams = z.infer<typeof getMyFavoriteListParamsSchema>;
