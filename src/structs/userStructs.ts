import {
  coerce,
  nonempty,
  nullable,
  object,
  partial,
  string,
  size,
  number,
} from "superstruct";

const CoerceNumber = coerce(number(), string(), (value) => Number(value));

export const UpdateUserBodyStruct = partial(
  object({
    nickname: nonempty(size(string(), 2, 20)),
    image: nullable(string()),
  })
);

export const ChangePasswordBodyStruct = object({
  password: nonempty(string()),
  newPassword: size(string(), 8, 100),
});
