import prisma from '../../prisma/prisma.js';
import Article from '../model/article.model.js';
import { NotFoundError } from '../errors/notFoundError.js';
import { ValidationError } from '../errors/validationError.js';
import { cursorPaginationOption } from '../utils/cursorPagination.js';
import { ForbiddenError } from '../errors/forbiddenError.js';

function getFindOption(req) {
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);

  const skip = (page - 1) * limit;
  const keyword = req.query.keyword;

  const findOption = {
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  };

  if (keyword) {
    findOption.where = {
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
      ],
    };
  }

  return { findOption, page, limit };
}

export const articleGet = async function (req, res, next) {
  try {
    const { findOption, page, limit } = getFindOption(req);
    const userId = req.user ? BigInt(req.user.userId) : null;

    const [entities, totalCount] = await Promise.all([
      prisma.article.findMany({
        ...findOption,
        include: {
          likes: userId ? { where: { userId }, select: { id: true } } : false,
        },
      }),
      prisma.article.count({ where: findOption.where }),
    ]);

    const articles = entities.map((entity) => ({
      ...Article.fromEntity(entity),
      isLiked: userId ? entity.likes.length > 0 : false,
    }));

    res.status(200).json({
      message: 'article list 조회 성공',
      data: articles,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const articleFindGet = async function (req, res, next) {
  try {
    const articleId = BigInt(req.params.articleId);
    const userId = req.user ? BigInt(req.user.userId) : null;

    const entity = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    if (!entity) {
      throw new NotFoundError('해당 게시물을 찾을 수 없습니다.');
    }

    const isLiked = userId ? entity.likes.length > 0 : false;

    const article = Article.fromEntity(entity);

    res.status(200).json({ message: 'article 조회 성공', data: { ...article, isLiked } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const articleCreate = async function (req, res, next) {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;

    const entity = await prisma.article.create({
      data: {
        title,
        content,
        userId: BigInt(userId),
      },
    });

    const newArticle = Article.fromEntity(entity);

    res.status(201).json({ message: 'article 생성 성공', data: newArticle });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const articleUpdate = async function (req, res, next) {
  try {
    const articleId = BigInt(req.params.articleId);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }

    if (article.userId !== BigInt(req.user.userId)) {
      throw new ForbiddenError('유저 아이디가 일치하지 않습니다.');
    }

    const { title, content } = req.body;

    const entity = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
    });

    const updateArticle = Article.fromEntity(entity);

    res.status(200).json({ message: 'article 수정 성공', data: updateArticle });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const articleDelete = async function (req, res, next) {
  try {
    const articleId = BigInt(req.params.articleId);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }

    if (article.userId !== BigInt(req.user.userId)) {
      throw new ForbiddenError('유저 아이디가 일치하지 않습니다.');
    }

    await prisma.article.delete({
      where: { id: BigInt(articleId) },
    });

    res.status(204).end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const createArticleComment = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);
    const articleId = BigInt(req.params.articleId);

    const { content } = req.body;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundError('해당 게시물을 찾을 수 없습니다.');
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        userId,
      },
    });

    res.status(201).json({
      message: '댓글 등록 성공',
      data: {
        id: comment.id.toString(),
        content: comment.content,
        createdAt: comment.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const getArticleComments = async (req, res, next) => {
  try {
    const articleId = BigInt(req.params.articleId);

    const cursor = req.query.cursor;
    const limit = Number(req.query.limit ?? 10);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundError('해당 게시물을 찾을 수 없습니다.');
    }

    const comments = await prisma.comment.findMany(
      cursorPaginationOption({
        cursor,
        limit,
        where: { articleId },
      }),
    );

    const nextCursor = comments.length > 0 ? comments[comments.length - 1].id.toString() : null;

    res.status(200).json({
      data: comments.map((c) => ({
        id: c.id.toString(),
        content: c.content,
        createdAt: c.createdAt,
      })),
      nextCursor,
    });
  } catch (e) {
    next(e);
  }
};

export const uploadArticleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('이미지 파일이 필요합니다.');
    }

    const imagePath = `/uploads/article/${req.file.filename}`;

    res.status(201).json({
      message: '이미지 업로드 성공',
      imageUrl: imagePath,
    });
  } catch (e) {
    next(e);
  }
};
