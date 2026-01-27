"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginBody = exports.RegisterBody = void 0;
const zod_1 = require("zod");
exports.RegisterBody = zod_1.z.object({
    email: zod_1.z.string().email("올바른 이메일 형식이 아닙니다."),
    nickname: zod_1.z.string().min(2, "닉네임은 최소 2글자 이상이어야 합니다."),
    password: zod_1.z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다."),
});
exports.LoginBody = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4),
});
//# sourceMappingURL=auth.js.map