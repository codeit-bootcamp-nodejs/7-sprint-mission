import { object, string } from 'superstruct';

export const RegisterStruct = object({
  email: string(),
  nickname: string(),
  password: string(),
});

export const LoginStruct = object({
  email: string(),
  password: string(),
});
