import { nonempty, object, partial, string } from "superstruct";
//email, nickname, password 를 입력하여 회원가입을 진행합니다.

export const RegisterBodyStruct = object({
  email: nonempty(string()),
  nickname: nonempty(string()),
  password: nonempty(string()),
});
export const LoginBodyStruct = object({
  email: nonempty(string()),
  password: nonempty(string()),
});
