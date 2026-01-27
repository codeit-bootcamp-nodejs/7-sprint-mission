"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_js_1 = require("../lib/withAsync.js");
const images_controller_js_1 = require("../controllers/images.controller.js");
const imagesRouter = express_1.default.Router();
imagesRouter.post("/upload", images_controller_js_1.upload.single("image"), (0, withAsync_js_1.withAsync)(images_controller_js_1.uploadImage));
exports.default = imagesRouter;
//# sourceMappingURL=images.router.js.map