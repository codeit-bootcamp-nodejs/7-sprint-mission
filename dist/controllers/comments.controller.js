"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const prismaClient_js_1 = require("../lib/prismaClient.js");
const errors_js_1 = require("../lib/errors.js");
const commons_js_1 = require("../validation/commons.js");
const comments_js_1 = require("../validation/comments.js");
async function updateComment(req, res) {
    const userId = req.user.id;
    const { id } = commons_js_1.IdParams.parse(req.params);
    const { content } = comments_js_1.UpdateComment.parse(req.body);
    const existing = await prismaClient_js_1.prisma.comment.findUnique({
        where: { id },
        select: { id: true, userId: true },
    });
    if (!existing)
        throw new errors_js_1.NotFoundError("comment", id);
    if (existing.userId !== userId) {
        throw new ForbiddenError("작성자만 수정할 수 있습니다.");
    }
    const updated = await prismaClient_js_1.prisma.comment.update({
        where: { id },
        data: { content },
    });
    return res.json(updated);
}
async function deleteComment(req, res) {
    const userId = req.user.id;
    const { id } = commons_js_1.IdParams.parse(req.params);
    const existing = await prismaClient_js_1.prisma.comment.findUnique({
        where: { id },
        select: { id: true, userId: true },
    });
    if (!existing)
        throw new errors_js_1.NotFoundError("comment", id);
    if (existing.userId !== userId) {
        throw new ForbiddenError("작성자만 삭제할 수 있습니다.");
    }
    await prismaClient_js_1.prisma.comment.delete({ where: { id } });
    return res.status(204).send();
}
//# sourceMappingURL=comments.controller.js.map