import { Product, UnregisteredProduct } from "./product.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import productCommentRouter from "./product-comment.route.js";
import productImageRouter from "./product-image.route.js";

const productRouter = new Router();

productRouter.use("/:productId/image", productImageRouter);
productRouter.use("/:productId/comments", productCommentRouter);

// 특정 게시글 조회 (404 예시)
productRouter.route("/:id").get(async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    // ID 유효성 검사 (400 에러)
    if (isNaN(productId)) {
      throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
    }

    const entity = await prisma.product.findUnique({
      where: { id: productId },
    });

    // 게시글이 없으면 404 에러
    if (!entity) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    res.json(Product.fromEntity(entity));
  } catch (e) {
    next(e);
  }
});

productRouter.post("/", async (req, res, next) => {
  try {
    const unregistered = UnregisteredProduct.fromInfo(req.body);
    console.log(unregistered);
    const newEntity = await prisma.product.create({ data: unregistered });
    res.json(Product.fromEntity(newEntity));
  } catch (e) {
    next(e);
  }
});

export default productRouter;
