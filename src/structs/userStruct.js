import {object, string, partial, nonempty, nullable} from 'superstruct';

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