import { nonempty, object, partial, string } from "superstruct";
//email, nickname, password 를 입력하여 회원가입을 진행합니다.
import { PageParamsStruct } from "./commonStructs.js";

export const GetRegisterListParamsStruct = PageParamsStruct;

export const UpdateRegisterBodyStruct = object({
  nickname: nonempty(string()),
});

export const UpdatePasswordBodyStruct = object({
  password: nonempty(string()),
});
