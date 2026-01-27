"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorParams = exports.PageParams = exports.IdParams = void 0;
const zod_1 = require("zod");
exports.IdParams = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
exports.PageParams = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    pageSize: zod_1.z.coerce.number().int().positive().default(10),
    orderBy: zod_1.z.enum(["recent"]).optional(),
    keyword: zod_1.z.string().min(1).optional(),
});
exports.CursorParams = zod_1.z.object({
    cursor: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default("10"),
    orderBy: zod_1.z.enum(["recent"]).optional(),
    keyword: zod_1.z.string().min(1).optional(),
});
//# sourceMappingURL=commons.js.map