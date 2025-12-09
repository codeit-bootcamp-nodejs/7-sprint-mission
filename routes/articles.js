import { Article, UnregisteredArticle } from "./articleValidate.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../errors/error.js";
import { articleCommentRouter } from "./articleComment.js";
import { validateArticlePost } from "./middlewareForArticle.js";
const articleRouter = new Router();

//게시글 생성
articleRouter.post("/", validateArticlePost, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      throw new BadRequestError("제목과 내용은 필수로 입력되야해");
    }
    const newEntity = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    const newArticle = Article.fromEntity(newEntity);

    return res.status(201).json({
      message: "등록 성공!!",
      data: newArticle,
    });
  } catch (error) {
    next(error);
  }
});

//게시글 상세조회
articleRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);
    if (isNaN(articleId)) {
      throw new BadRequestError("게시글 ID는 숫자로 입력해!!");
    }
    const articleEntity = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!articleEntity) {
      throw new NotFoundError("게시글을 찾을수 없엉");
    }
    const article = Article.fromEntity(articleEntity);
    return res.status(200).json({
      message: "제발 작성 성공해라",
      data: article,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
//게시글 수정
articleRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);
    if (isNaN(articleId)) {
      throw new BadRequestError("게시글 ID는 숫자로 입력해!!");
    }

    const updateData = req.body;
    const updateArticle = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
    });

    res.status(200).json({
      message: "게시글이 수정되었당",
    });
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("게시글을 찾을수 없엉");
    }
    next(e);
  }
});

//상품삭제
articleRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);
    if (isNaN(articleId)) {
      throw new BadRequestError("게시글 ID는 숫자로 입력해!!");
    }
    const deleteArticle = await prisma.article.delete({
      where: { id: articleId },
    });
    res.status(200).json({
      message: "게시글이 삭제되었당!",
    });
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("게시글을 찾을수 없엉");
    }
    next(e);
  }
});

function getFind(req) {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const findOption = {
    skip: (page - 1) * size,
    take: size,
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

//상품목록조회
articleRouter.get("/", async (req, res, next) => {
  try {
    const findOption = getFind(req);
    findOption.select = {
      id: true,
      title: true,
      content: true,
      created_at: true,
    };
    const articles = (await prisma.article.findMany(findOption)).map(
      Article.fromEntity
    );
    return res.status(200).json({
      message: "게시글 목록 조회 성공",
      data: articles,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
articleRouter.use("/:articleId/comments", articleCommentRouter);
export default articleRouter;
