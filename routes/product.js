import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

class Product {
  constructor(id, name, description, price, tags, createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  // 가져온 DB객체를 응답하기 쉽게 미리 변환해주는 로직.
  static fromEntity(entity) {
    return new Product(
      entity.id.toString(),
      entity.name,
      entity.description,
      entity.price,
      entity.tags,
      entity.created_at
    );
  }
}

// 최신순으로 정렬 및 키워드가 포함된 단어로 검색 가능하게 해주는 로직.
function getFindOptionFrom(req) {
  const findOption = {
    // DB에서 created_at 기준으로 가장 최근 순서로 정렬해서 가져옴.
    // 옵션에서 정렬 방향을 지정할 때는 문자열처럼 감싸야 함.
    orderBy: { created_at: "desc" },
  };
  // 요청한 단어가 존재한다면,
  if (req.query.keyword) {
    findOption.where = {
      // OR은 이 배열 안에 하나라도 조건이 만족한다면
      OR: [
        { name: { contains: req.query.keyword } },
        { description: { contains: req.query.keyword } },
        { tags: { contains: req.query.keyword } },
      ],
    };
  }
  return findOption;
}

// 상품 전체 조회
router.get("/", async (req, res, next) => {
  try {
    const findOption = getFindOptionFrom(req);
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
router.get("/:id", async (req, res, next) => {
  // parseInt를 하지 않으면 String타입으로 가져오게 됨
  // id의 존재 유무를 따지기 위해선 데이터 타입이 같아야 함.
  const id = parseInt(req.params.id);
  try {
    // id 조회 및 유무 따지기
    const unique = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    // 존재하지 않는다면
    if (!unique) {
      return res.status(404).json({ message: "Product not found" });
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
router.post("/", async (req, res, next) => {
  // req.body를 받아서 해당 객체에 할당한다.
  const { name, description, price, tags } = req.body;
  try {
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
router.patch("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { name, description, price, tags } = req.body;
  try {
    const patchProduct = await prisma.product.update({
      where: { id: id },
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
    if (e.code === P2025) {
      return res.status(404).json({
        message: `${id}인 상품을 찾을 수 없습니다.`,
        errorCode: "NOT_FOUND",
      });
    }
    console.error("상품 수정 오류", e);
    next(e);
  }
});

// 상품 삭제 => 특정 경로 id 가져와서 그냥 delete 하면 되지 않을까..
router.delete("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const deleteProduct = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    const deletedProduct = Product.fromEntity(deleteProduct);
    res.json(deletedProduct);
  } catch (e) {
    console.error("상품 삭제 오류", e);
    next(e);
  }
});

export default router;
