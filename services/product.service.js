import prisma from '../prisma/client.js';

export const createProduct = async (data) => await prisma.product.create({ data });

export const getProducts = async (limit = 10, offset = 0, keyword = '') => {
  const where = keyword ? {
    OR: [
      { name: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
    ]
  } : {};
  const [list, totalCount] = await prisma.$transaction([
    prisma.product.findMany({ where, take: limit, skip: offset, orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where }),
  ]);
  return { list, totalCount };
};

export const getProductById = async (id) => await prisma.product.findUnique({ 
  where: { id: parseInt(id) },
  include: { comments: true }
});
export const updateProduct = async (id, data) => await prisma.product.update({ where: { id: parseInt(id) }, data });
export const deleteProduct = async (id) => await prisma.product.delete({ where: { id: parseInt(id) } });
