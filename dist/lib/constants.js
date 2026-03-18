"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_COOKIE_NAME = exports.ACCESS_TOKEN_COOKIE_NAME = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.STATIC_PATH = exports.PUBLIC_PATH = exports.PORT = exports.DATABASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 3000;
exports.PUBLIC_PATH = "./public";
exports.STATIC_PATH = "/public";
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
exports.ACCESS_TOKEN_COOKIE_NAME = "accessToken";
exports.REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
//# sourceMappingURL=constants.js.map