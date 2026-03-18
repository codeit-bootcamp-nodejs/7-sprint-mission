"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArticle = exports.GetArticleList = exports.CreateArticle = void 0;
const zod_1 = require("zod");
const commons_js_1 = require("./commons.js");
exports.CreateArticle = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    image: zod_1.z.array(zod_1.z.string()).optional().default([]),
});
exports.GetArticleList = commons_js_1.PageParams;
exports.UpdateArticle = exports.CreateArticle.partial();
//# sourceMappingURL=articles.js.map