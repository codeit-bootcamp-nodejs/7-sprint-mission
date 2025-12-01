import { Article, UnregisteredArticle } from "./article.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
const router = new Router();

router.get("/", async (req, res, next) => {
  try {
    const findArticlesOption = getFindArticlesOption(req.query);
    const entities = await prisma.article.findMany(findArticlesOption);
    const knonwArticles = entities.map(Article.fromEntity);
    res.json(knonwArticles);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const unregistered = UnregisteredArticle.fromInfo(req.body);
    const newEntity = await prisma.article.create({ data: unregistered });
    res.json(Article.fromEntity(newEntity));
  } catch (e) {
    next(e);
  }
});

function getFindArticlesOption({ keyword, page = "1", limit = "10" }) {
  //최신순(recent)으로 정렬할 수 있습니다.
  const option = {
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  };
  //title, content에 포함된 단어로 검색할 수 있습니다.
  if (keyword) {
    option.where = {
      OR: [
        {
          title: {
            contains: keyword,
          },
        },
        {
          content: {
            contains: keyword,
          },
        },
      ],
    };
  }
  return option;
}

export default router;
