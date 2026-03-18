"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const constants_js_1 = require("./lib/constants.js");
const auth_routers_js_1 = __importDefault(require("./routers/auth.routers.js"));
const articles_router_js_1 = __importDefault(require("./routers/articles.router.js"));
const products_router_js_1 = __importDefault(require("./routers/products.router.js"));
const comments_router_js_1 = __importDefault(require("./routers/comments.router.js"));
const images_router_js_1 = __importDefault(require("./routers/images.router.js"));
const user_router_js_1 = __importDefault(require("./routers/user.router.js"));
const errorhandler_js_1 = __importDefault(require("./ middlewares/errorhandler.js"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(constants_js_1.STATIC_PATH, express_1.default.static(path_1.default.resolve(process.cwd(), constants_js_1.PUBLIC_PATH)));
app.use("/auth", auth_routers_js_1.default);
app.use("/articles", articles_router_js_1.default);
app.use("/products", products_router_js_1.default);
app.use("/comments", comments_router_js_1.default);
app.use("/images", images_router_js_1.default);
app.use("/user", user_router_js_1.default);
app.use(errorhandler_js_1.default);
// 등록된 모든 라우트를 터미널에 출력해주는 코드
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
    else if (r.name === "router") {
        r.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`${Object.keys(handler.route.methods)} ${handler.route.path}`);
            }
        });
    }
});
app.listen(constants_js_1.PORT, () => {
    console.log(`Server started on port ${constants_js_1.PORT}`);
});
//# sourceMappingURL=main.js.map