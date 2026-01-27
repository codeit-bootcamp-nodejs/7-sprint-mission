"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_js_1 = require("../lib/prismaClient.js");
const errors_js_1 = require("../lib/errors.js");
const auth_js_1 = require("../validation/auth.js");
const token_js_1 = require("../lib/token.js");
const cookies_js_1 = require("../lib/cookies.js");
async function register(req, res) {
    const { email, nickname, password } = auth_js_1.RegisterBody.parse(req.body);
    const isEmailExist = await prismaClient_js_1.prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
    if (isEmailExist)
        throw new errors_js_1.BadRequestError("이미 사용 중인 이메일입니다.");
    const isNicknameExist = await prismaClient_js_1.prisma.user.findUnique({
        where: { nickname },
        select: { id: true },
    });
    if (isNicknameExist)
        throw new errors_js_1.ConflictError("이미 사용 중인 닉네임입니다.");
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prismaClient_js_1.prisma.user.create({
        data: {
            email,
            nickname,
            password: hashedPassword,
        },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
}
async function login(req, res) {
    const { email, password } = auth_js_1.LoginBody.parse(req.body);
    const user = await prismaClient_js_1.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
        throw new errors_js_1.BadRequestError("아이디 비밀번호 틀렸습니다");
    }
    const { accessToken, refreshToken } = (0, token_js_1.generateTokens)(user.id);
    (0, cookies_js_1.setTokenCookies)(res, accessToken, refreshToken);
    res.status(200).send({ message: "로그인 성공" });
}
async function logout(res) {
    (0, cookies_js_1.clearTokenCookies)(res);
    res.status(200).json({ message: "로그아웃 성공" });
}
//# sourceMappingURL=auth.controller.js.map