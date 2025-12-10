import { Article, UnregisteredArticle } from "./articleClass.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";
import articleCommentRouter from "./article-comment.route.js";
import articleImageRouter from "./article_image.js";

const articleRouter = new Router();

articleRouter.use("/:articleId/image", articleImageRouter);
articleRouter.use("/:articleId/comments", articleCommentRouter);

function getFindArticlesOption({ keyword, page = "1", limit = "10" }) {
  //최신순(recent)으로 정렬할 수 있습니다.
  const skip = (parseInt(page) - 1) * limit;
  const take = parseInt(limit);
  if (isNaN(skip) || isNaN(take)) {
    throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
  }
  const option = {
    skip,
    take,
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

articleRouter.get("/", validateGetArticles, async (req, res, next) => {
  try {
    const findOption = getFindArticlesOption(req.query);
    const result = await prisma.article.findMany(findOption);
    const articles = result.map(Article.fromEntity);
    res.json(articles);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

articleRouter.post("/", validatePostArticle, async (req, res, next) => {
  try {
    const unregistered = UnregisteredArticle.fromInfo(req.body);
    const newEntity = await prisma.article.create({ data: unregistered });
    res.json(Article.fromEntity(newEntity));
  } catch (e) {
    next(e);
  }
});
articleRouter.get("/:id", validateGetArticle, async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    // ID 유효성 검사 (400 에러)
    if (isNaN(articleId)) {
      throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
    }

    const entity = await prisma.article.findUnique({
      where: { id: articleId },
    });

    // 게시글이 없으면 404 에러
    if (!entity) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    res.json(Article.fromEntity(entity));
  } catch (e) {
    next(e);
  }
});
articleRouter.patch("/:id", validatePatchArticle, async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);
    // ID 유효성 검사 (400 에러)
    if (isNaN(articleId)) {
      throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
    }

    const articles = await prisma.article.update({
      where: { id: articleId },
      data: req.body,
    });

    // 게시글이 없으면 404 에러
    if (!articles) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }
    res.json(Article.fromEntity(articles));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

articleRouter.delete("/:id", validateDeleteArticle, async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      throw new BadRequestError("유효하지 않은 게시글 ID입니다.");
    }
    await prisma.article.delete({
      where: { id: articleId },
    });
    res.status(204).send();
    console.log("정상삭제");
  } catch (e) {
    console.error(e);
    next(e);
  }
});
export default articleRouter;

function validateDeleteArticle(req, res, next) {
  next();
}
function validatePatchArticle(req, res, next) {
  next();
}
function validateGetArticles(req, res, next) {
  next();
}
function validateGetArticle(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new BadRequestError("id가 왜 이럼??");
  next();
}
function validatePostArticle(req, res, next) {
  next();
}
