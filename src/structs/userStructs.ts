import { object, string, size, optional, nonempty, Infer } from 'superstruct';

export const UpdateUserBodyStruct = object({
  nickname: optional(size(string(), 2, 20)),
  image: optional(string()),
});
export type UpdateUserBody = Infer<typeof UpdateUserBodyStruct>;

export const ChangePasswordBodyStruct = object({
  currentPassword: nonempty(string()),
  newPassword: nonempty(size(string(), 3, 20)),
});
export type ChangePasswordBody = Infer<typeof ChangePasswordBodyStruct>;
