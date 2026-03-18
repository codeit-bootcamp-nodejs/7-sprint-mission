"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const constants_js_1 = require("../lib/constants.js");
const token_js_1 = require("../lib/token.js");
const prismaClient_js_1 = require("../lib/prismaClient.js");
function authenticate(options = { optional: false }) {
    return async (req, res, next) => {
        const token = req.cookies?.[constants_js_1.ACCESS_TOKEN_COOKIE_NAME];
        if (!token) {
            if (options.optional)
                return next();
            return res.status(401).json({ message: "토큰 없음" });
        }
        try {
            const { userId } = (0, token_js_1.verifyAccessToken)(token);
            const user = await prismaClient_js_1.prisma.user.findUnique({
                where: { id: userId },
                select: { id: true },
            });
            if (!user)
                return res.status(401).json({ message: "유저 없음" });
            req.user = { id: user.id };
            return next();
        }
        catch {
            return res.status(401).json({ message: "유효하지 않은 토큰" });
        }
    };
}
//# sourceMappingURL=authenticate.js.map