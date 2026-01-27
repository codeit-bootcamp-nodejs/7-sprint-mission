import { z } from "zod";

export const CreateComment = z.object({
  content: z.string().min(1, "내용을 입력해주세요."),
});

export const GetCommentListParams = z.object({
  cursor: z.coerce.number().int().positive().nullable().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export const UpdateComment = CreateComment.partial();
