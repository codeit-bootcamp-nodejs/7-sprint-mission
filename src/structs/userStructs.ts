import { object, string, optional } from 'superstruct';

export const UpdateUserStruct = object({
  nickname: optional(string()),
  image: optional(string()),
});

export const UpdatePasswordStruct = object({
  password: string(),
  newPassword: string(),
});
