import { z } from "zod";

export const RegisterBody = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  nickname: z.string().min(2, "닉네임은 최소 2글자 이상이어야 합니다."),
  password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다."),
});

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
