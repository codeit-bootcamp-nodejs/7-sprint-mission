import { prisma } from "../../../prisma/prisma.js";
import { Product, UnregisteredProduct } from "./entities/product.js";

export const createProduct = async (productInfo) => {
  const unregistere = UnregisteredProduct.fromInfo(productInfo);
  const product = await prisma.product.create({
    data: unregistere,
  });

  return Product.fromEntity(product);
};

export const getProducts = async ({
  page = 1,
  limit = 10,
  sort = "desc",
  keyword,
}) => {
  const searchWhere = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const [totalCount, products] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      where: searchWhere,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { createdAt: sort },
    }),
  ]);

  return {
    totalCount,
    limit,
    currentPage: page,
    totalPage: Math.ceil(totalCount / limit),
    data: Product.fromEntity(products),
  };
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: BigInt(id) },
  });

  return Product.fromEntity(product);
};

export const deleteProductById = async (id) => {
  const deletedProduct = await prisma.product.delete({
    where: { id: BigInt(id) },
  });

  return Product.fromEntity(deletedProduct);
};

export const updateProductById = async (id, { price, tags }) => {
  const updatedProduct = await prisma.product.update({
    where: { id: BigInt(id) },
    data: {
      ...(price !== undefined && { price }),
      ...(tags !== undefined && { tags }),
    },
  });

  return Product.fromEntity(updatedProduct);
};
