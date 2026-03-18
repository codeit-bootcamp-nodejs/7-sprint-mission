"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withAsync_js_1 = require("../lib/withAsync.js");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", (0, withAsync_js_1.withAsync)(auth_controller_js_1.register));
authRouter.post("/login", (0, withAsync_js_1.withAsync)(auth_controller_js_1.login));
authRouter.post("/logout", (0, withAsync_js_1.withAsync)(auth_controller_js_1.logout));
exports.default = authRouter;
//# sourceMappingURL=auth.routers.js.map