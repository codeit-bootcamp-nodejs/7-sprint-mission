"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const superstruct_1 = require("superstruct");
const prismaClient_js_1 = require("../lib/prismaClient.js");
const commentsStruct_js_1 = require("../structs/commentsStruct.js");
const NotFoundError_js_1 = __importDefault(require("../lib/errors/NotFoundError.js"));
const commonStructs_js_1 = require("../structs/commonStructs.js");
const UnauthorizedError_js_1 = __importDefault(require("../lib/errors/UnauthorizedError.js"));
const ForbiddenError_js_1 = __importDefault(require("../lib/errors/ForbiddenError.js"));
async function updateComment(req, res) {
    if (!req.user) {
        throw new UnauthorizedError_js_1.default('Unauthorized');
    }
    const { id } = (0, superstruct_1.create)(req.params, commonStructs_js_1.IdParamsStruct);
    const { content } = (0, superstruct_1.create)(req.body, commentsStruct_js_1.UpdateCommentBodyStruct);
    const existingComment = await prismaClient_js_1.prismaClient.comment.findUnique({ where: { id } });
    if (!existingComment) {
        throw new NotFoundError_js_1.default('comment', id);
    }
    if (existingComment.userId !== req.user.id) {
        throw new ForbiddenError_js_1.default('Should be the owner of the comment');
    }
    const updatedComment = await prismaClient_js_1.prismaClient.comment.update({
        where: { id },
        data: { content },
    });
}
async function deleteComment(req, res) {
    if (!req.user) {
        throw new UnauthorizedError_js_1.default('Unauthorized');
    }
    const { id } = (0, superstruct_1.create)(req.params, commonStructs_js_1.IdParamsStruct);
    const existingComment = await prismaClient_js_1.prismaClient.comment.findUnique({ where: { id } });
    if (!existingComment) {
        throw new NotFoundError_js_1.default('comment', id);
    }
    if (existingComment.userId !== req.user.id) {
        throw new ForbiddenError_js_1.default('Should be the owner of the comment');
    }
    await prismaClient_js_1.prismaClient.comment.delete({ where: { id } });
}
//# sourceMappingURL=commentsController.js.map