"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_js_1 = require("../lib/errors.js");
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error("======= ERROR LOG =======");
    console.error(err);
    console.error("=========================");
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: err.errors?.[0]?.message || "잘못된 요청입니다.",
            details: err.errors,
        });
    }
    if (err instanceof errors_js_1.HttpError) {
        const status = err.statusCode || err.status;
        return res.status(status).json({
            status: status,
            message: err.message,
        });
    }
    const status = 500;
    const message = "서버 내부 오류 발생.";
    return res.status(status).json({
        status: status,
        message: message,
        error: err.message,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorhandler.js.map