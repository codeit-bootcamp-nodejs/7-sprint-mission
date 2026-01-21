import { BadRequestError } from "../errors/customErrors.js";

export const string = (
  value: unknown,
  message = "필수 입력값입니다."
): string => {
  if (typeof value !== "string") throw new BadRequestError(message);
  const trimmed = value.trim();
  if (!trimmed) throw new BadRequestError(message);
  return trimmed;
};

export const number = (
  value: unknown,
  message = "숫자를 입력해 주세요."
): number => {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (!Number.isFinite(n)) throw new BadRequestError(message);
  return n;
};

export const int = (
  value: unknown,
  message = "요청 값이 올바르지 않습니다."
): number => {
  const n = number(value, message);
  if (!Number.isInteger(n)) throw new BadRequestError(message);
  return n;
};

export const positiveInt = (
  value: unknown,
  message = "요청 값이 올바르지 않습니다."
): number => {
  const n = int(value, message);
  if (n <= 0) throw new BadRequestError(message);
  return n;
};

export const stringArray = (
  value: unknown,
  message = "요청 값이 올바르지 않습니다."
): string[] => {
  if (!Array.isArray(value)) throw new BadRequestError(message);

  return value.map((v) => {
    if (typeof v !== "string") throw new BadRequestError(message);
    const t = v.trim();
    if (!t) throw new BadRequestError(message);
    return t;
  });
};

export const optionalString = (
  value: unknown,
  message = "요청 값이 올바르지 않습니다."
): string | undefined => {
  if (value === undefined) return undefined;
  return string(value, message); 
};

export const optionalInt = (
  value: unknown,
  message = "요청 값이 올바르지 않습니다."
): number | undefined => {
  if (value === undefined) return undefined;
  return int(value, message); 
};

export const optionalPositiveInt = (
  value: unknown,
  message = "요청 값이 올바르지 않습니다."
): number | undefined => {
  if (value === undefined || value === "") return undefined;
  return positiveInt(value, message); 
};

export const optionalStringArray = (
  value: unknown,
  message = "요청 값이 올바르지 않습니다."
): string[] | undefined => {
  if (value === undefined) return undefined;
  return stringArray(value, message); 
};

