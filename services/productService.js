import { error } from "console";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../utils/CustomErrors.js";

//상품 목록조회
export async function getProducts(req, res, next) {
  try {
    const { page, pageSize, orderBy, keyword } = create(
      req.query,
      GetProductListParamsStruct
    );

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
      : undefined;
    const totalCount = await prismaClient.product.count({ where });
    const products = await prismaClient.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
      where,
    });

    return res.send({
      list: products,
      totalCount,
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

    const getProduct = await prisma.product.findUnique({
      where: { id: id },
    });
    if (!getProduct) {
      throw new NotFoundError(message);
    }
    res.send(getProduct);
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
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

//페이지 네이션
function getFindOptionFrom(req) {
  const findOption = {
    orderBy: { created_at: "desc" },
  };
  //limit 처리
  if (req.query.limit) {
    const limit = parseInt(req.query.limit, 10);
    if (!isNaN(limit) || limit <= 0) {
      throw new BadRequestError("limit 값은 1 이상이여야 합니다.");
    }
    findOption.take = limit;
  }
  if (req.query.offset) {
    const offset = parseInt(req.query.offset, 10);
    if (!isNaN(offset) && offset >= 0) findOption.skip = offset;
  }
  // name, description 에 포함된 단어로 검색 가능
  if (req.query.search) {
    findOption.where = {
      OR: [
        { name: { contains: searchKeyword } },
        { description: { contains: searchKeyword } },
      ],
    };
  }
  return findOption;
}
