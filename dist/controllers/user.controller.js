"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.changePassword = changePassword;
exports.getMyProducts = getMyProducts;
exports.likedProducts = likedProducts;
const prismaClient_js_1 = require("../lib/prismaClient.js");
const errors_js_1 = require("../lib/errors.js");
const user_js_1 = require("../validation/user.js");
async function getMe(req, res) {
    const user = await prismaClient_js_1.prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            nickname: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new errors_js_1.NotFoundError("유저를 찾을 수 없습니다.");
    }
    return res.json(user);
}
async function updateMe(req, res) {
    const data = user_js_1.UpdateMe.parse(req.body);
    const updated = await prismaClient_js_1.prisma.user.update({
        where: { id: req.user.id },
        data,
        select: {
            id: true,
            email: true,
            nickname: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return res.json(updated);
}
async function changePassword(req, res) {
    const { currentPassword, newPassword } = user_js_1.ChangePassword.parse(req.body);
    const user = await prismaClient_js_1.prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, password: true },
    });
    if (!user) {
        throw new errors_js_1.NotFoundError("유저를 찾을 수 없습니다.");
    }
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
        throw new errors_js_1.BadRequestError("현재 비밀번호가 일치하지 않습니다.");
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prismaClient_js_1.prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashed },
    });
    return res.json({ message: "비밀번호가 변경되었습니다." });
}
async function getMyProducts(req, res) {
    const { page, pageSize } = user_js_1.GetproductParams.parse(req.query);
    const skip = (page - 1) * pageSize;
    const data = await prismaClient_js_1.prisma.product.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: { id: true, name: true, price: true, createdAt: true },
    });
    return res.json({ data });
}
async function likedProducts(req, res) {
    const likes = await prismaClient_js_1.prisma.productLike.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            product: true,
        },
    });
    return res.send(likes.map((like) => ({
        ...like.product,
        isLiked: true,
    })));
}
//# sourceMappingURL=user.controller.js.map