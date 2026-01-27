import { Product, UnregisteredProduct } from "./product.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import productCommentRouter from "./product-comment.route.js";

const productRouter = new Router();

productRouter.use("/:productId/comments", productCommentRouter);

// 상품 전체 조회
productRouter.get("/", validateGetProducts, async (req, res, next) => {
  try {
    const findOption = getFindOptionFrom(req.query);
    const entities = await prisma.product.findMany(findOption);
    const products = entities.map(Product.fromEntity);
    res.json(products);
  } catch (e) {
    console.error("상품조회 오류", e);
    next(e);
  }
});

// 특정 상품 조회 => 특정 경로의 id를 조회 한다
// 특정 경로의 id가 존재하는지 유무를 따져서 있으면 res 없으면 err
productRouter.get("/:id", validateGetProduct, async (req, res, next) => {
  // parseInt를 하지 않으면 String타입으로 가져오게 됨
  // id의 존재 유무를 따지기 위해선 데이터 타입이 같아야 함.
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    // id 조회 및 유무 따지기
    const unique = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    // 존재하지 않는다면
    if (!unique) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }
    // 존재한다면
    const product = Product.fromEntity(unique);
    res.json(product);
  } catch (e) {
    console.error("특정 상품 조회 오류", e);
    next(e);
  }
});

// 상품 등록 => req.body를 받아서 응답한다.
productRouter.post("/", validatePostProduct, async (req, res, next) => {
  try {
    // req.body를 받아서 해당 객체에 할당한다.
    const unregistered = UnregisteredProduct.fromInfo(req.body);
    const { name, description, price, tags } = unregistered;
    const postProduct = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        tags: tags,
      },
    });
    // res.json(postProduct)를 한다면 무조건 typeError가 뜬다.
    // 우리가 위에 작성한 fromEntity로 직렬화 변환을 해줘서 응답을 해야하기 때문에
    // newPost라는 필터를 거쳐준 응답을 해주어야 함.
    const newPost = Product.fromEntity(postProduct);
    console.log("정상 등록");
    res.json(newPost);
  } catch (e) {
    console.error("상품 등록 오류", e);
    next(e);
  }
});

// 상품 수정 => 특정 경로 id로 찾아가서 특정 상품 조회 및 req.body 업데이트하기
productRouter.patch("/:id", validatePatchProduct, async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    const unregistered = UnregisteredProduct.fromInfo(req.body);
    const { name, description, price, tags } = unregistered;
    const patchProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name,
        description: description,
        price: price,
        tags: tags,
      },
    });
    const updateProduct = Product.fromEntity(patchProduct);
    res.json(updateProduct);
    // 존재하지 않는다면 / 존재한다면 의 더 디테일한 예외처리가 가능하지만
    // 굳이 작성하지 않아도 어차피 catch 예외처리 구문으로 넘어가서 걱정 ㄴㄴ.
  } catch (e) {
    // update() 함수에서는 수정할려는 id가 존재하지 않으면 에러를 띄움.
    // 이 에러 코드가 "P2025"임.
    console.error("상품 수정 오류", e);
    next(e);
  }
});

// 상품 삭제 => 특정 경로 id 가져와서 그냥 delete 하면 되지 않을까..
productRouter.delete("/:id", validateDeleteProduct, async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    const deletedProduct = Product.fromEntity(deleteProduct);
    res.json(deletedProduct);
  } catch (e) {
    console.error("상품 삭제 오류", e);
    next(e);
  }
});

// ------------------- 유효성 검사---------------------------

// 최신순으로 정렬 및 키워드가 포함된 단어로 검색 가능하게 해주는 로직.
function getFindOptionFrom(keyword, page = "1", limit = "10") {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  if (isNaN(skip)) {
    throw new BadRequestError("유효하지 않는 ID입니다.");
  }

  const option = {
    skip,
    take,
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  };
  if (keyword) {
    // 요청한 단어가 존재한다면,
    option.where = {
      // OR은 이 배열 안에 하나라도 조건이 만족한다면
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
        { tags: { contains: keyword } },
      ],
    };
  }
  return option;
}

// --------------- 미들웨어 -------------------------------
function validateDeleteProduct(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new BadRequestError("id가 왜 이럼??");
  next();
}
function validatePatchProduct(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new BadRequestError("id가 왜 이럼??");
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

export default productRouter;
