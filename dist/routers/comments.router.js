"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_js_1 = require("../lib/withAsync.js");
const authenticate_js_1 = require("../ middlewares/authenticate.js");
const comments_controller_js_1 = require("../controllers/comments.controller.js");
const commentsRouter = express_1.default.Router();
commentsRouter.patch("/:id", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(comments_controller_js_1.updateComment));
commentsRouter.delete("/:id", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(comments_controller_js_1.deleteComment));
exports.default = commentsRouter;
//# sourceMappingURL=comments.router.js.map