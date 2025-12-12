import { prisma } from "../../../prisma/prisma.js";
import { Article, UnregisteredArticle } from "./entities/article.js";

export const createArticle = async (articleInfo) => {
  const unregistere = UnregisteredArticle.fromInfo(articleInfo);
  const newEntity = await prisma.article.create({ data: unregistere });

  return Article.fromEntity(newEntity);
};

export const deletedArticleById = async (id) => {
  const deletedArticle = await prisma.article.delete({
    where: { id: BigInt(id) },
  });

  return Article.fromEntity(deletedArticle);
};

export const updateArticleById = async (id, { title, content }) => {
  const updatedArticle = await prisma.article.update({
    where: { id: BigInt(id) },
    data: { title, content },
  });

  return Article.fromEntity(updatedArticle);
};

export const getArticles = async ({
  page = 1,
  limit = 10,
  sort = "desc",
  keyword,
}) => {
  const searchWhere = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const [totalCount, articles] = await Promise.all([
    prisma.article.count(),
    prisma.article.findMany({
      where: searchWhere,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { created_at: sort },
    }),
  ]);
  const newArticles = articles.map((article) => {
    return Article.fromEntity(article);
  });

  return {
    totalCount,
    limit,
    currentPage: page,
    totalPage: Math.ceil(totalCount / limit),
    data: newArticles,
  };
};
