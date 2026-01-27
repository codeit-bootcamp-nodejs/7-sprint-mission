"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenCookies = setTokenCookies;
exports.clearTokenCookies = clearTokenCookies;
const constants_js_1 = require("./constants.js");
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
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(constants_js_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, accessCookieOptions());
    res.cookie(constants_js_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshCookieOptions());
}
function clearTokenCookies(res) {
    res.clearCookie(constants_js_1.ACCESS_TOKEN_COOKIE_NAME, accessCookieOptions());
    res.clearCookie(constants_js_1.REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions());
}
//# sourceMappingURL=cookies.js.map