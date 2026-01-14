import {
  coerce,
  integer,
  object,
  string,
  defaulted,
  optional,
  enums,
  nonempty,
  Infer,
} from 'superstruct';

/** 문자열을 숫자로 바꾸고 정수인지 확인하는 로직 */
const integerString = coerce(integer(), string(), (value) => parseInt(value));

//ID 파라미터 타입
export const IdParamsStruct = object({
  id: integerString,
});
export type IdParams = Infer<typeof IdParamsStruct>;

//페이지네이션 파라미터 타입
export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  orderBy: optional(enums(['recent'])),
  keyword: optional(nonempty(string())),
});
export type PageParams = Infer<typeof PageParamsStruct>;

//커서 기반 파라미터 타입
export const CursorParamsStruct = object({
  cursor: defaulted(integerString, 0),
  limit: defaulted(integerString, 10),
  orderBy: optional(enums(['recent'])),
  keyword: optional(nonempty(string())),
});
export type CursorParams = Infer<typeof CursorParamsStruct>;
