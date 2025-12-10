// routes/users.js
import { Product, UnregisteredProduct } from "./productClass.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";
import productCommentRouter from "./product-comment.route.js";
import productImageRouter from "./product_image.js";

const productRouter = new Router();

productRouter.use("/:productId/image", productImageRouter);
productRouter.use("/:productId/comments", productCommentRouter);

function getFindProductsOption({ keyword, page = "1", limit = "10" }) {
  //최신순(recent)으로 정렬할 수 있습니다.

  const skip = (parseInt(page) - 1) * limit;
  const take = parseInt(limit);
  if (isNaN(skip) || isNaN(take)) {
    throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
  }
  const option = {
    skip,
    take,
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  };
  //title, content에 포함된 단어로 검색할 수 있습니다.
  if (keyword) {
    option.where = {
      OR: [
        {
          name: {
            contains: keyword,
          },
        },
        {
          description: {
            contains: keyword,
          },
        },
      ],
    };
  }
  return option;
}
// /products

productRouter.get("/", validateGetProducts, async (req, res, next) => {
  try {
    const findOption = getFindProductsOption(req.query);
    const result = await prisma.product.findMany(findOption);
    const products = result.map(Product.fromEntity);
    res.json(products);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

productRouter.post("/", validatePostProduct, async (req, res, next) => {
  try {
    const unregistered = UnregisteredProduct.fromInfo(req.body);
    const newEntity = await prisma.product.create({ data: unregistered });
    res.json(Product.fromEntity(newEntity));
  } catch (e) {
    next(e);
  }
});

productRouter.get("/:id", validateGetProduct, async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    // ID 유효성 검사 (400 에러)
    if (isNaN(productId)) {
      throw new BadRequestError("유효하지 않은 상품 ID입니다.");
    }

    const entity = await prisma.product.findUnique({
      where: { id: productId },
    });

    // 상품이 없으면 404 에러
    if (!entity) {
      throw new NotFoundError("상품을 찾을 수 없습니다.");
    }

    res.json(Product.fromEntity(entity));
  } catch (e) {
    next(e);
  }
});

productRouter.patch("/:id", validatePatcProduct, async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    // ID 유효성 검사 (400 에러)
    if (isNaN(productId)) {
      throw new BadRequestError("유효하지 않은 상품 ID입니다.");
    }

    const products = await prisma.product.update({
      where: { id: productId },
      data: req.body,
    });

    // 게시글이 없으면 404 에러
    if (!products) {
      throw new NotFoundError("상품을 찾을 수 없습니다.");
    }
    res.json(Product.fromEntity(products));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

productRouter.delete("/:id", validateDeleteProduct, async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      throw new BadRequestError("유효하지 않은 상품 ID입니다.");
    }
    await prisma.product.delete({
      where: { id: productId },
    });
    res.status(204).send();
    console.log("정상삭제");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default productRouter;

function validateDeleteProduct(req, res, next) {
  next();
}
function validatePatcProduct(req, res, next) {
  next();
}
function validateGetProducts(req, res, next) {
  next();
}
function validateGetProduct(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new BadRequestError("id가 왜 이럼??");
  next();
}
function validatePostProduct(req, res, next) {
  next();
}
