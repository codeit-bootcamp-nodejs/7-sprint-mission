"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_js_1 = require("../lib/withAsync.js");
const products_controller_js_1 = require("../controllers/products.controller.js");
const authenticate_js_1 = require("../ middlewares/authenticate.js");
const productsRouter = express_1.default.Router();
productsRouter.post("/", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(products_controller_js_1.createProduct));
productsRouter.get("/:id", (0, withAsync_js_1.withAsync)(products_controller_js_1.getProduct));
productsRouter.patch("/:id", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(products_controller_js_1.updateProduct));
productsRouter.delete("/:id", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(products_controller_js_1.deleteProduct));
productsRouter.get("/", (0, withAsync_js_1.withAsync)(products_controller_js_1.getProductList));
productsRouter.post("/:id/comments", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(products_controller_js_1.createProductComment));
productsRouter.get("/:id/comments", (0, withAsync_js_1.withAsync)(products_controller_js_1.getCommentList));
productsRouter.post("/:id/like", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(products_controller_js_1.likeProduct));
productsRouter.delete("/:id/like", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(products_controller_js_1.unlikeProduct));
exports.default = productsRouter;
//# sourceMappingURL=products.router.js.map