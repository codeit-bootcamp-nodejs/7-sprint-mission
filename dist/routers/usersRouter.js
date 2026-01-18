"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_js_1 = require("../lib/withAsync.js");
const usersController_js_1 = require("../controllers/usersController.js");
const authenticate_js_1 = __importDefault(require("../middlewares/authenticate.js"));
const usersRouter = express_1.default.Router();
usersRouter.get('/me', (0, authenticate_js_1.default)(), (0, withAsync_js_1.withAsync)(usersController_js_1.getMe));
usersRouter.patch('/me', (0, authenticate_js_1.default)(), (0, withAsync_js_1.withAsync)(usersController_js_1.updateMe));
usersRouter.patch('/me/password', (0, authenticate_js_1.default)(), (0, withAsync_js_1.withAsync)(usersController_js_1.updateMyPassword));
usersRouter.get('/me/products', (0, authenticate_js_1.default)(), (0, withAsync_js_1.withAsync)(usersController_js_1.getMyProductList));
usersRouter.get('/me/favorites', (0, authenticate_js_1.default)(), (0, withAsync_js_1.withAsync)(usersController_js_1.getMyFavoriteList));
exports.default = usersRouter;
//# sourceMappingURL=usersRouter.js.map