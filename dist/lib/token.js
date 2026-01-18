"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
function generateTokens(userId) {
    const accessToken = jsonwebtoken_1.default.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
}
function verifyAccessToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.id };
}
function verifyRefreshToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.id };
}
//# sourceMappingURL=token.js.map