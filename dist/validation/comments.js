"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComment = exports.GetCommentListParams = exports.CreateComment = void 0;
const zod_1 = require("zod");
const commons_js_1 = require("./commons.js");
exports.CreateComment = zod_1.z.object({
    content: zod_1.z.string().min(1, "내용을 입력해주세요."),
});
exports.GetCommentListParams = commons_js_1.CursorParams;
exports.UpdateComment = exports.CreateComment.partial();
//# sourceMappingURL=comments.js.map