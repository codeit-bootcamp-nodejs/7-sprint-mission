import prisma from '../prisma/prisma';
import type { Prisma } from '@prisma/client';
import type { CreateArticleDto, UpdateArticleDto } from '../types/article.type';
import { cursorPaginationOption } from '../utils/cursorPagination';
import type { CommentDto } from '../types/comment.type';

interface FindOption {
  skip: number;
  take: number;
  orderBy: Prisma.ArticleOrderByWithRelationInput;
  where?: Prisma.ArticleWhereInput;
}

// 게시글 존재 여부 확인용
export const findArticle = async (articleId: bigint) => {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  return article;
};

function findArticlesOption(page: number, limit: number, keyword: string | undefined) {
  const skip = (page - 1) * limit;

  const findOption: FindOption = {
    skip: skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  };

  if (keyword) {
    const searchFilter: Prisma.StringFilter = {
      contains: keyword,
      mode: 'insensitive',
    };

    findOption.where = {
      OR: [{ title: searchFilter }, { content: searchFilter }],
    };
  }

  return findOption;
}

export const findArticles = async (
  page: number,
  limit: number,
  keyword: string | undefined,
  userId: bigint | null,
) => {
  const findOption = findArticlesOption(page, limit, keyword);

  const [entities, totalCount] = await Promise.all([
    prisma.article.findMany({
      ...findOption,
      include: {
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    }),
    prisma.article.count({
      ...(findOption.where && { where: findOption.where }),
    }),
  ]);

  return { entities, totalCount };
};

// 게시글 상세 조회 리포지토리
export const findDetailArticle = async (articleId: bigint, userId: bigint | null) => {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      likes: userId ? { where: { userId }, select: { id: true } } : false,
    },
  });

  return article;
};

//게시글 생성 리포지토리
export const createArticleRepository = async (userId: bigint, dto: CreateArticleDto) => {
  const { title, content } = dto;
  const entity = await prisma.article.create({
    data: {
      title,
      content,
      userId,
    },
  });

  return entity;
};

// 게시글 수정 리포지토리
export const updateArticleRepository = async (articleId: bigint, dto: UpdateArticleDto) => {
  const { title, content } = dto;

  const entity = await prisma.article.update({
    where: { id: articleId },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
  });

  return entity;
};

// 게시글 삭제 리포지토리
export const deleteArticleRepository = async (articleId: bigint) => {
  await prisma.article.delete({
    where: { id: articleId },
  });
};

// 게시글 댓글 생성 리포지토리
export const createArticleCommnetRepository = async (
  articleId: bigint,
  userId: bigint,
  dto: CommentDto,
) => {
  const { content } = dto;
  const comment = await prisma.comment.create({
    data: {
      content,
      articleId,
      userId,
    },
  });

  return comment;
};
// 게시글 댓글 목록 조회 리포지토리
export const getArticleCommentsRepository = async (
  articleId: bigint,
  limit: number,
  cursor: bigint | undefined,
) => {
  const comments = await prisma.comment.findMany(
    cursorPaginationOption({
      cursor: cursor,
      limit: limit + 1,
      where: { articleId },
    }),
  );

  return comments;
};
