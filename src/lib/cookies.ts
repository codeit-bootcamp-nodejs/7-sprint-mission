import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "./constants.js";

const isProd = process.env.NODE_ENV === "production";

function accessCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 1000,
  };
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, accessCookieOptions());
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshCookieOptions());
}

export function clearTokenCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, accessCookieOptions());
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions());
}
