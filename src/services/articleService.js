import { prisma } from "../../prisma/prisma.js";

// 게시글 생성
export const createArticle = async ({ userId, title, content }) => {
  return prisma.article.create({
    data: { user_id: userId, title, content },
  });
};

// 게시글 조회
export const getArticleById = async (id, userId = null) => {
  return prisma.article.findUnique({
    where: { id },
    ...(userId
      ? {
          include: {
            likes: {
              where: { user_id: userId },
              select: { id: true },
            },
          },
        }
      : {}),
  });
};


// 게시글 수정
export const updateArticle = async (id, data) => {
  return prisma.article.update({
    where: { id },
    data,
  });
};

// 게시글 삭제
export const deleteArticle = async (id) => {
  return prisma.article.delete({
    where: { id },
  });
};

// 게시글 목록 조회 (offset/검색/최신순)
export const listArticles = async ({ limit, offset, sort, search, keyword, userId = null }) => {
  const searchValue = search ?? keyword;

  const take = limit ? parseInt(limit, 10) : 10;
  const skip = offset ? parseInt(offset, 10) : 0;

  const findOption = { skip, take };

  findOption.orderBy = { created_at: "desc" };

  if (searchValue) {
    findOption.where = {
      OR: [
        { title: { contains: searchValue } },
        { content: { contains: searchValue } },
      ],
    };
  }

  if (userId) {
    findOption.include = {
      likes: { where: { user_id: userId }, select: { id: true } },
    };
  }

  return prisma.article.findMany(findOption);
};

// 게시글 댓글 생성
export const createArticleComment = async ({ userId, articleId, content }) => {
  return prisma.comment.create({
    data: {
      user_id: userId,
      content,
      article_id: articleId,
    },
  });
};

// 게시글 댓글 목록 조회 (cursor)
export const listArticleCommentsCursor = async ({ articleId, limit, cursorId }) => {
  const take = limit ? parseInt(limit, 10) : 10;

  const query = {
    where: { article_id: articleId },
    orderBy: { id: "desc" },
    take,
  };

  if (cursorId) {
    const cursor = BigInt(cursorId);
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  const entities = await prisma.comment.findMany(query);

  const last = entities[entities.length - 1];
  const nextCursorId = last ? last.id.toString() : null;

  return { entities, nextCursorId };
};
