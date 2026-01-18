"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.refreshToken = refreshToken;
const superstruct_1 = require("superstruct");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_js_1 = require("../lib/prismaClient.js");
const token_js_1 = require("../lib/token.js");
const constants_js_1 = require("../lib/constants.js");
const authStructs_js_1 = require("../structs/authStructs.js");
const BadRequestError_js_1 = __importDefault(require("../lib/errors/BadRequestError.js"));
async function register(req, res) {
    const { email, nickname, password } = (0, superstruct_1.create)(req.body, authStructs_js_1.RegisterBodyStruct);
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    const isExist = await prismaClient_js_1.prismaClient.user.findUnique({ where: { email } });
    if (isExist) {
        throw new BadRequestError_js_1.default('User already exists');
    }
    const user = await prismaClient_js_1.prismaClient.user.create({
        data: { email, nickname, password: hashedPassword },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
}
async function login(req, res) {
    const { email, password } = (0, superstruct_1.create)(req.body, authStructs_js_1.LoginBodyStruct);
    const user = await prismaClient_js_1.prismaClient.user.findUnique({ where: { email } });
    if (!user) {
        throw new BadRequestError_js_1.default('Invalid credentials');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new BadRequestError_js_1.default('Invalid credentials');
    }
    const { accessToken, refreshToken } = (0, token_js_1.generateTokens)(String(user?.id));
    setTokenCookies(res, accessToken, refreshToken);
    res.status(200).send();
}
async function logout(req, res) {
    clearTokenCookies(res);
    res.status(200).send();
}
async function refreshToken(req, res) {
    const refreshToken = req.cookies[constants_js_1.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
        throw new BadRequestError_js_1.default('Invalid refresh token');
    }
    const { userId } = (0, token_js_1.verifyRefreshToken)(refreshToken);
    const user = await prismaClient_js_1.prismaClient.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
        throw new BadRequestError_js_1.default('Invalid refresh token');
    }
    const { accessToken, refreshToken: newRefreshToken } = (0, token_js_1.generateTokens)(userId);
    setTokenCookies(res, accessToken, newRefreshToken);
    res.status(200).send();
}
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(constants_js_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: constants_js_1.NODE_ENV === 'production',
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(constants_js_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: constants_js_1.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/auth/refresh',
    });
}
function clearTokenCookies(res) {
    res.clearCookie(constants_js_1.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(constants_js_1.REFRESH_TOKEN_COOKIE_NAME);
}
//# sourceMappingURL=authController.js.map