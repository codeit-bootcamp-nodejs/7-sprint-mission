import { error } from "console";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../utils/CustomErrors.js";

//상품 목록조회
export async function getProducts(req, res, next) {
  try {
    const findOption = getFindOptionFrom(req);
    const totalCount = await prisma.product.count({
      where: findOption.where,
    });
    const products = await prisma.product.findMany(findOption);

    res.status(200).send({
      totalCount: totalCount, // 전체 개수
      limit: findOption.take || 10, // 현재 페이지 limit 정보
      offset: findOption.skip || 0, // 현재 페이지 offset 정보
      data: products,
    });
  } catch (e) {
    next(e);
  }
}

//상품 등록
export async function createProduct(req, res, next) {
  try {
    const body = req.body;
    const { name, description, price, tags } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });
    res.status(201).send(newProduct);
  } catch (e) {
    next(e);
  }
}

//상품 목록 상세 조회
export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      throw new BadRequestError(`유효하지 않은 상품 ID '${id}'입니다.`);
    }
    const getProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!getProduct) {
      throw new NotFoundError(`상품 ID ${id}를 찾을 수 없습니다.`);
    }
    res.status(200).send(getProduct);
  } catch (e) {
    next(e);
  }
}

//상품 수정
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;
    const updateProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price,
        tags,
      },
    });
    res.send(updateProduct);
  } catch (e) {
    next(e);
  }
}

//상품 삭제
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: id },
    });
    res.status(204).send({ message: "상품이 성공적으로 삭제되었습니다." });
  } catch (e) {
    next(e);
  }
}

//페이지 네이션
function getFindOptionFrom(req) {
  const findOption = {
    orderBy: { created_at: "desc" },
  };
  const { limit, offset, search } = req.query;
  //limit 처리
  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new BadRequestError("limit 값은 1 이상의 숫자여야 합니다.");
    }
    findOption.take = parsedLimit;
  } else {
    // limit이 없을 경우 기본값 설정
    findOption.take = 10;
  }
  if (offset) {
    const parsedOffset = parseInt(offset, 10);
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      throw new BadRequestError("offset 값은 0 이상의 숫자여야 합니다.");
    }
    findOption.skip = parsedOffset;
  }

  // name, description 에 포함된 단어로 검색 가능
  if (search) {
    findOption.where = {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ],
    };
  }
  return findOption;
}
