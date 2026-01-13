import {object, string, partial, nonempty, nullable, Infer} from 'superstruct';

export const UpdateUserBodyStruct = partial(
    object({
   nickname: nonempty(string()),
   image: nullable(string()),
})
);

export const UpdatePasswordBodyStruct = object({
   oldPassword: nonempty(string()),
   newPassword: nonempty(string()),
})

export type UpdateUserBody = Infer<typeof UpdateUserBodyStruct>;
export type UpdatePasswordBody = Infer<typeof UpdatePasswordBodyStruct>;