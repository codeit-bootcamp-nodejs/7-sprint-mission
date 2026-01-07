import { object, string, nonempty, pattern, size, optional } from 'superstruct';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CreateRegisterBodyStruct = object({
  email: nonempty(pattern(string(), emailRegex)),
  nickname: nonempty(size(string(), 2, 20)),
  password: nonempty(size(string(), 3, 20)),
  image: optional(string()),
});

export const LoginBodyStruct = object({
  email: nonempty(pattern(string(), emailRegex)),
  password: nonempty(string()),
});