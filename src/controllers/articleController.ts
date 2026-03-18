import type { Request, Response } from "express";

import * as articleService from "../services/articleService.js";
import { Article } from "../constructors/article.js";
import { Comment } from "../constructors/comment.js";
import { HttpError, NotFoundError } from "../../errors/customErrors.js";
import * as notificationService from "../services/notificationService.js";

// JS 서비스와 TS 컨트롤러 경계 캐스팅
const articleServiceBridge = articleService as {
  createArticle: (params: {
    userId: bigint;
    title?: string;
    content?: string;
  }) => Promise<unknown>;
  getArticleById: (id: bigint, userId?: bigint | null) => Promise<any>;
  updateArticle: (
    id: bigint,
    data: { title?: string; content?: string }
  ) => Promise<unknown>;
  deleteArticle: (id: bigint) => Promise<unknown>;
  listArticles: (params: {
    limit?: string;
    offset?: string;
    sort?: string;
    search?: string;
    keyword?: string;
    userId?: bigint | null;
  }) => Promise<unknown[]>;
  createArticleComment: (params: {
    userId: bigint;
    articleId: bigint;
    content: string;
  }) => Promise<unknown>;
  listArticleCommentsCursor: (params: {
    articleId: bigint;
    limit?: string;
    cursorId?: string;
  }) => Promise<{
    entities: unknown[];
    nextCursorId: string | null;
  }>;
};


// 게시글 생성 요청 바디
type CreateArticleBody = {
  title?: string;
  content?: string;
};


// 게시글 수정 요청 바디
type UpdateArticleBody = {
  title?: string;
  content?: string;
};


// 댓글 생성 요청 바디
type CreateCommentBody = {
  content?: string;
};


// 게시글 목록 조회 query
type ListArticlesQuery = {
  limit?: unknown;
  offset?: unknown;
  sort?: unknown;
  search?: unknown;
  keyword?: unknown;
};


// 게시글 id 문자열 → bigint 변환
function parseBigIntId(value: string, resourceName: string): bigint {
  try {
    return BigInt(value);
  } catch {
    throw new HttpError(`${resourceName} id가 올바르지 않습니다.`, 400);
  }
}


// 로그인 필수 userId 추출
function getRequiredUserId(req: Request): bigint {
  const userId = req.user?.userId;

  if (!userId) {
    throw new HttpError("인증이 필요합니다.", 401);
  }

  return BigInt(userId);
}


// 로그인 선택 userId 추출
function getOptionalUserId(req: Request): bigint | null {
  const userId = req.user?.userId;
  return userId ? BigInt(userId) : null;
}


// query string 안전 변환
function getQueryString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}


// 게시글 생성
export const create = async (
  req: Request<Record<string, never>, unknown, CreateArticleBody>,
  res: Response
) => {
  const { title, content } = req.body;

  const entity = await articleServiceBridge.createArticle({
    userId: getRequiredUserId(req),
    title,
    content,
  });

  res.status(201).json(Article.fromEntity(entity));
};


// 게시글 상세 조회
export const detail = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = parseBigIntId(req.params.id, "게시글");
  const userId = getOptionalUserId(req);

  const entity = await articleServiceBridge.getArticleById(id, userId);

  if (!entity) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  res.status(200).json(Article.fromEntity(entity));
};


// 게시글 수정
export const update = async (
  req: Request<{ id: string }, unknown, UpdateArticleBody>,
  res: Response
) => {
  const id = parseBigIntId(req.params.id, "게시글");

  const exists = await articleServiceBridge.getArticleById(id);
  if (!exists) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  const updated = await articleServiceBridge.updateArticle(id, req.body);

  res.status(200).json(Article.fromEntity(updated));
};


// 게시글 삭제
export const remove = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = parseBigIntId(req.params.id, "게시글");

  const exists = await articleServiceBridge.getArticleById(id);
  if (!exists) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  await articleServiceBridge.deleteArticle(id);

  res.status(204).send();
};


// 게시글 목록 조회
export const list = async (
  req: Request<Record<string, never>, unknown, unknown, ListArticlesQuery>,
  res: Response
) => {
  const entities = await articleServiceBridge.listArticles({
    limit: getQueryString(req.query.limit),
    offset: getQueryString(req.query.offset),
    sort: getQueryString(req.query.sort),
    search: getQueryString(req.query.search),
    keyword: getQueryString(req.query.keyword),
    userId: getOptionalUserId(req),
  });

  res.status(200).json(
    entities.map((entity: unknown) => Article.fromEntity(entity))
  );
};


// 게시글 댓글 생성
export const createComment = async (
  req: Request<{ id: string }, unknown, CreateCommentBody>,
  res: Response
) => {
  const articleId = parseBigIntId(req.params.id, "게시글");
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new HttpError("댓글 내용을 입력해 주세요.", 400);
  }

  const article = await articleServiceBridge.getArticleById(articleId);

  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  const requesterId = getRequiredUserId(req);

  const commentEntity = await articleServiceBridge.createArticleComment({
    userId: requesterId,
    articleId,
    content,
  });

  // 내 게시물 댓글 알림 생성
  if (article.user_id !== requesterId) {
    await notificationService.createNotification({
      userId: article.user_id.toString(),
      type: "ARTICLE_COMMENT",
      resourceType: "ARTICLE",
      resourceId: articleId.toString(),
      message: "내 게시글에 새로운 댓글이 달렸습니다.",
    });
  }

  res.status(201).json(Comment.fromEntity(commentEntity));
};


// 게시글 댓글 목록 조회
export const listComments = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const articleId = parseBigIntId(req.params.id, "게시글");

  const { entities, nextCursorId } =
    await articleServiceBridge.listArticleCommentsCursor({
      articleId,
      limit: getQueryString(req.query.limit),
      cursorId: getQueryString(req.query.cursorId),
    });

  res.status(200).json({
    items: entities.map((entity: unknown) => Comment.fromEntity(entity)),
    nextCursorId,
  });
};