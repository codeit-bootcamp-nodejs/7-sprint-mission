import express from "express";
import { prisma } from "../prisma/prisma.js";
const router = express.Router();

class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.created_at
    );
  }
}

// 게시글 목록 조회 API를 만들어 주세요.
// id, title, content, createdAt를 조회합니다.
// todo: offset 방식의 페이지네이션 기능을 포함해 주세요.

function getFindOptionFrom(req) {
  // 최신순(recent)으로 정렬할 수 있습니다.
  // title, content에 포함된 단어로 검색할 수 있습니다.
  const findOption = {
    orderBy: { created_at: "desc" },
  };
  if (req.query.keyword) {
    findOption.where = {
      OR: [
        { title: { contains: req.query.keyword } },
        { content: { contains: req.query.keyword } },
      ],
    };
  }
  return findOption;
}

router.get("/", async (req, res, next) => {
  try {
    const findOption = getFindOptionFrom(req);
    const entities = await prisma.article.findMany(findOption);
    const articles = entities.map(Article.fromEntity);
    res.json(articles);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get("/", (req, res, next) =>
  Promise.resolve(getFindOptionFrom(req))
    .then(prisma.article.findMany)
    .then((entities) => entities.map(Article.fromEntity))
    .then(res.json)
    .catch((err) => {
      console.error(err);
      next(err);
    })
);

export default router;
