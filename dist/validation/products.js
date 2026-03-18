"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProduct = exports.GetProductList = exports.CreateProduct = void 0;
const zod_1 = require("zod");
const commons_js_1 = require("./commons.js");
exports.CreateProduct = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    price: zod_1.z.coerce.number().int().min(0),
    tags: zod_1.z.array(zod_1.z.string()).optional().default([]),
    images: zod_1.z.array(zod_1.z.string()).optional().default([]),
});
exports.GetProductList = commons_js_1.PageParams;
exports.UpdateProduct = exports.CreateProduct.partial();
//# sourceMappingURL=products.js.map