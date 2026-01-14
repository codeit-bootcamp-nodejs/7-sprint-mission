import { object, string, size, optional, nonempty } from 'superstruct';


export const UpdateUserBodyStruct = object({
    nickname: optional(size(string(), 2, 20)),
    image: optional(string()),
});


export const ChangePasswordBodyStruct = object({
    currentPassword: nonempty(string()),
    newPassword: nonempty(size(string(), 3, 20)),
});