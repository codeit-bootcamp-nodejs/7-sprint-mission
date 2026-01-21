import jwt, { type JwtPayload } from "jsonwebtoken";
import { InternalServerError } from "../errors/customErrors.js";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const requireSecret = (s: string | undefined, name: string): string => {
  if (!s) throw new InternalServerError(`${name} 환경변수가 설정되어 있지 않습니다.`);
  return s;
};

export type AccessTokenPayload = { userId: string };

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, requireSecret(ACCESS_SECRET, "JWT_ACCESS_SECRET"), { expiresIn: "15m" });

export const verifyAccessToken = (token: string): JwtPayload & AccessTokenPayload =>
  jwt.verify(token, requireSecret(ACCESS_SECRET, "JWT_ACCESS_SECRET")) as JwtPayload & AccessTokenPayload;

export const signRefreshToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, requireSecret(REFRESH_SECRET, "JWT_REFRESH_SECRET"), { expiresIn: "14d" });

export const verifyRefreshToken = (token: string): JwtPayload & AccessTokenPayload =>
  jwt.verify(token, requireSecret(REFRESH_SECRET, "JWT_REFRESH_SECRET")) as JwtPayload & AccessTokenPayload;
