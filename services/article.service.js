import prisma from '../prisma/client.js';

export const createArticle = async (data) => await prisma.article.create({ data });
export const getArticles = async (limit = 10, offset = 0, keyword = '') => {
  const where = keyword ? {
    OR: [
      { title: { contains: keyword, mode: 'insensitive' } },
      { content: { contains: keyword, mode: 'insensitive' } },
    ]
  } : {};
  const [list, totalCount] = await prisma.$transaction([
    prisma.article.findMany({ where, take: limit, skip: offset, orderBy: { createdAt: 'desc' } }),
    prisma.article.count({ where }),
  ]);
  return { list, totalCount };
};
export const getArticleById = async (id) => await prisma.article.findUnique({ 
  where: { id: parseInt(id) },
  include: { comments: true }
});
export const updateArticle = async (id, data) => await prisma.article.update({ where: { id: parseInt(id) }, data });
export const deleteArticle = async (id) => await prisma.article.delete({ where: { id: parseInt(id) } });
