"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_js_1 = require("../lib/withAsync.js");
const authenticate_js_1 = require("../ middlewares/authenticate.js");
const user_controller_js_1 = require("../controllers/user.controller.js");
const userRouter = express_1.default.Router();
userRouter.get("/me", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(user_controller_js_1.getMe));
userRouter.patch("/me", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(user_controller_js_1.updateMe));
userRouter.patch("/me/password", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(user_controller_js_1.changePassword));
userRouter.get("/me/products", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(user_controller_js_1.getMyProducts));
userRouter.get("/me/liked", (0, authenticate_js_1.authenticate)(), (0, withAsync_js_1.withAsync)(user_controller_js_1.likedProducts));
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map