import { prisma } from "../lib/prismaClient.js";
import { NotFoundError, ForbiddenError, ConflictError } from "../lib/errors.js";
import { IdParams } from "../validation/commons.js";
import {
  CreateArticle,
  UpdateArticle,
  GetArticleList,
} from "../validation/articles.js";
import { CreateComment, GetCommentListParams } from "../validation/comments.js";

export async function createArticle(req, res) {
  const userId = req.user.id;
  const data = CreateArticle.parse(req.body);

  const article = await prisma.article.create({
    data: { ...data, userId },
  });

  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id } = IdParams.parse(req.params);
  const userId = req.user?.id ?? null;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      likes: userId
        ? {
            where: { userId },
            select: { id: true },
            take: 1,
          }
        : false,
    },
  });

  if (!article) {
    throw new NotFoundError("article", id);
  }

  const isLiked = userId ? article.likes.length > 0 : false;
  return res.send({
    ...article,
    isLiked,
    likes: undefined,
  });
}

export async function updateArticle(req, res) {
  const { id } = IdParams.parse(req.params);
  const data = UpdateArticle.parse(req.body);

  const existingArticle = await prisma.article.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existingArticle) throw new NotFoundError("article", id);

  if (existingArticle.userId !== userId) {
    throw new ForbiddenError("작성자만 수정할 수 있습니다.");
  }

  const updatedAriticle = await prisma.article.update({ where: { id }, data });

  return res.send(updatedAriticle);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParams);
  const existingArticle = await prisma.article.findUnique({
    where: { id },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", id);
  }

  if (existingArticle.userId !== userId) {
    throw new ForbiddenError("작성자만 삭제할 수 있습니다.");
  }

  await prisma.article.delete({ where: { id } });

  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetArticleList
  );

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prisma.article.count({ where });
  const articles = await prisma.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}
// 댓글관련
export async function createArticleComment(req, res) {
  const userId = req.user.id;
  const { id: articleId } = IdParams.parse(req.params);
  const { content } = CreateComment.parse(req.body);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true },
  });
  if (!article) throw new NotFoundError("article", articleId);

  const comment = await prisma.comment.create({
    data: { content, userId, articleId },
  });

  return res.status(201).json(comment);
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParams);
  const { cursor, limit } = create(req.query, GetCommentListParams);

  const existingProduct = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!existingProduct) {
    throw new NotFoundError("article", articleId);
  }

  const fetched = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { id: "desc" },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
    take: limit + 1,
  });

  const hasNext = fetched.length > limit;
  const list = fetched.slice(0, limit);
  const nextCursor = hasNext ? list[list.length - 1].id : null;

  return res.send({ list, nextCursor });
}

//좋아요

const ensureArticleExists = async (articleId) => {
  const a = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true },
  });
  if (!a) throw new NotFoundError("article", articleId);
};

export const likeArticle = async (req, res) => {
  const userId = req.user.id;
  const articleId = Number(req.params.articleId);

  await ensureArticleExists(articleId);

  try {
    await prisma.articleLike.create({
      data: { userId, articleId },
    });
  } catch (e) {
    if (e?.code === "P2002") {
      throw new ConflictError("이미 좋아요한 게시글입니다.");
    }
    throw e;
  }

  return res.status(201).json({ message: "liked" });
};

export const unlikeArticle = async (req, res) => {
  const userId = req.user.id;
  const articleId = Number(req.params.articleId);

  await ensureArticleExists(articleId);

  try {
    await prisma.articleLike.delete({
      where: {
        userId_articleId: { userId, articleId },
      },
    });
  } catch (e) {
    if (e?.code === "P2025") {
      throw new BadRequestError("좋아요하지 않은 게시글입니다.");
    }
    throw e;
  }

  return res.status(200).json({ message: "unliked" });
};
