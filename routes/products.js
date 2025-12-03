import { Product, UnregisteredProduct } from "./productValidate.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../errors/error.js";
import { validateProductPost } from "./middlewareForProduct.js";
import { productCommentRouter } from "./productComment.js";
const productRouter = new Router();

//상품생성
productRouter.post("/", validateProductPost, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    if (!name || !price) {
      throw new BadRequestError("이름과 가격은 필수로 입력되야해");
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      throw new BadRequestError("가격은 숫자거나 0보다 커야해");
    }

    const newEntity = await prisma.product.create({
      data: {
        name: name,
        description,
        price: numPrice,
        tags,
      },
    });
    const newProduct = Product.fromEntity(newEntity);
    return res.status(201).json({
      message: "등록 성공!!",
      data: newProduct,
    });
  } catch (e) {
    next(e);
  }
});

//상품상세조회
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) {
      throw new BadRequestError("상품 ID는 숫자로 입력해!");
    }
    const product = Product.fromEntity(
      await prisma.product.findUnique({
        where: { id: productId },
      })
    );
    if (!product) {
      throw new NotFoundError("상품을 찾을수 없엉");
    }
    return res.status(200).json({
      message: "제발 조회 성공해라",
      data: product,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
//상품수정
productRouter.patch("/:productId", async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) {
      throw new BadRequestError("상품 ID는 숫자로 입력해!");
    }

    const updateData = req.body;
    const updateProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    res.status(200).json({
      message: "상품이 수정되었당",
    });
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("상품을 찾을수 없엉");
    }
    next(e);
  }
});
//상품삭제
productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) {
      throw new BadRequestError("상품 ID는 숫자로 입력해!");
    }
    const deleteProduct = await prisma.product.delete({
      where: { id: productId },
    });
    res.status(200).json({
      message: "상품이 삭제되었당!",
    });
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("상품을 찾을수 없엉");
    }
    next(e);
  }
});

function getFind(req) {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const findOption = {
    skip: (page - 1) * size,
    take: size,
    orderBy: { created_at: "desc" },
  };
  if (req.query.keyword) {
    findOption.where = {
      OR: [
        { name: { contains: req.query.keyword } },
        { description: { contains: req.query.keyword } },
      ],
    };
  }
  return findOption;
}

//상품목록조회
productRouter.get("/", async (req, res, next) => {
  try {
    const findOption = getFind(req);
    findOption.select = {
      id: true,
      name: true,
      price: true,
      created_at: true,
    };
    const products = (await prisma.product.findMany(findOption)).map(
      Product.fromEntity
    );
    return res.status(200).json({
      message: "상품 목록 조회 성공",
      data: products,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
productRouter.use("/:productId/comments", productCommentRouter);
export default productRouter;
