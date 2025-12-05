import { prisma } from "../prisma/prisma.js";

//게시글 목록 조회
export async function getAllArticles(req, res, next) {
  try {
    const findOption = getFindOptionFrom(req);
    const articles = await prisma.article.findMany(findOption);
    const totalCount = await prisma.article.count({
      where: findOption.where,
    });

    res.send({
      totalCount: totalCount,
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
    res.send(newArticle);
  } catch (e) {
    next(e);
  }
}

//게시글 목록 상세 조회
export async function getArticleById(req, res, next) {
  try {
    const { id } = req.parmas;

    const getArticle = await prisma.article.findUnique({
      where: { id: id },
    });
    if (!getArticle) {
      throw new NotFoundError(message);
    }
    res.send(getArticle);
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
    res.send(updateArticle);
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
  } catch (e) {
    next(e);
  }
}

//페이지네이션
function getFindOptionFrom(req) {
  const findOption = {
    orderBy: { created_at: "desc" },
  };
  if (req.query.limit) {
    const limit = parseInt(req.query.limit, 10);
    if (!isNaN(limit) && limit > 0) findOption.take = limit;
  }
  if (req.query.offset) {
    const offset = parseInt(req.qurey.offset, 10);
    if (!isNaN(offset) && offset >= 0) findOption.skip = offset;
  }
  // name, description 에 포함된 단어로 검색 가능
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
