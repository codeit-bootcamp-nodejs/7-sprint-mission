"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_js_1 = require("../lib/withAsync.js");
const articles_controller_js_1 = require("../controllers/articles.controller.js");
const authenticate_js_1 = require("../ middlewares/authenticate.js");
const articlesRouter = express_1.default.Router();
articlesRouter.post("/", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(articles_controller_js_1.createArticle));
articlesRouter.get("/:id", (0, withAsync_js_1.withAsync)(articles_controller_js_1.getArticle));
articlesRouter.patch("/:id", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(articles_controller_js_1.updateArticle));
articlesRouter.delete("/:id", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(articles_controller_js_1.deleteArticle));
articlesRouter.get("/", (0, withAsync_js_1.withAsync)(articles_controller_js_1.getArticleList));
articlesRouter.post("/:id/comments", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(articles_controller_js_1.createArticleComment));
articlesRouter.get("/:id/comments", (0, withAsync_js_1.withAsync)(articles_controller_js_1.getCommentList));
articlesRouter.post("/:id/like", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(articles_controller_js_1.likeArticle));
articlesRouter.delete("/:id/like", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(articles_controller_js_1.unlikeArticle));
exports.default = articlesRouter;
//# sourceMappingURL=articles.router.js.map