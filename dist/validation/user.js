"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePassword = exports.UpdateMe = exports.GetproductParams = void 0;
const zod_1 = require("zod");
exports.GetproductParams = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(50).default(20),
    orderBy: zod_1.z.enum(["recent", "old"]).optional().default("recent"),
});
exports.UpdateMe = zod_1.z
    .object({
    nickname: zod_1.z.string().min(2).max(20).optional(),
    image: zod_1.z.string().url().optional().nullable(),
})
    .refine((obj) => Object.keys(obj).length > 0, {
    message: "수정할 값이 없습니다.",
});
exports.ChangePassword = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "현재 비밀번호는 필수입니다."),
    newPassword: zod_1.z
        .string()
        .min(8, "새 비밀번호는 8자 이상이어야 합니다.")
        .max(72),
});
//# sourceMappingURL=user.js.map