import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../utils/CustomErrors.js";

//게시글 목록 조회
export async function getAllArticles(req, res, next) {
  try {
    const findOption = getFindOptionFrom(req);
    const articles = await prisma.article.findMany(findOption);
    const totalCount = await prisma.article.count({
      where: findOption.where,
    });

    res.status(200).send({
      totalCount: totalCount,
      limit: findOption.take || 10,
      offset: findOption.skip || 0,
      data: articles,
    });
  } catch (e) {
    next(e);
  }
}

//게시글 등록
export async function creatArticles(req, res, next) {
  try {
    const body = req.body;
    const { title, content } = body;
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.status(204).send(newArticle);
  } catch (e) {
    next(e);
  }
}

//게시글 목록 상세 조회
export async function getArticleById(req, res, next) {
  try {
    const { id } = req.params;
    const articleId = parseInt(id, 10);

    if (isNaN(articleId)) {
      throw new BadRequestError(`유효하지 않은 아티클 ID '${id}'입니다.`);
    }

    const getArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!getArticle) {
      throw new NotFoundError(`아티클 ID ${id}를 찾을 수 없습니다.`);
    }
    res.status(200).send(getArticle);
  } catch (e) {
    next(e);
  }
}

//게시글 수정
export async function updateArticle(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updateArticle = await prisma.article.update({
      where: { id: id },
      data: {
        title,
        content,
      },
    });
    res.status(200).send(updateArticle);
  } catch (e) {
    next(e);
  }
}

//게시글 삭제
export async function deleteArticle(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: id },
    });
    res.status(204).send({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (e) {
    next(e);
  }
}

//페이지네이션
function getFindOptionFrom(req) {
  const findOption = {
    orderBy: { created_at: "desc" },
  };
  // 1. limit 처리
  if (req.query.limit) {
    const limit = parseInt(req.query.limit, 10);
    // 유효성 검사 수정: !isNaN(limit) && limit > 0
    if (!isNaN(limit) && limit > 0) findOption.take = limit;
  }

  if (req.query.offset) {
    const offset = parseInt(req.query.offset, 10);
    if (!isNaN(offset) && offset >= 0) findOption.skip = offset;
  }

  // 3. 키워드 검색 처리
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
