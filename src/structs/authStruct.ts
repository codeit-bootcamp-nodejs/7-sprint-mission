import { object, string, nonempty, pattern, size, optional, Infer } from 'superstruct';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CreateRegisterBodyStruct = object({
  email: nonempty(pattern(string(), emailRegex)),
  nickname: nonempty(size(string(), 2, 20)),
  password: nonempty(size(string(), 3, 20)),
  image: optional(string()),
});
export type CreateRegisterBody = Infer<typeof CreateRegisterBodyStruct>;

export const LoginBodyStruct = object({
  email: nonempty(pattern(string(), emailRegex)),
  password: nonempty(string()),
});

export type LoginBody = Infer<typeof LoginBodyStruct>;
