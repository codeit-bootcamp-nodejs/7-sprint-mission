import { z } from "zod";

export const GetproductParams = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  orderBy: z.enum(["recent", "old"]).optional().default("recent"),
});

export const UpdateMe = z
  .object({
    nickname: z.string().min(2).max(20).optional(),
    image: z.string().url().optional().nullable(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "수정할 값이 없습니다.",
  });

export const ChangePassword = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호는 필수입니다."),
  newPassword: z
    .string()
    .min(8, "새 비밀번호는 8자 이상이어야 합니다.")
    .max(72),
});
