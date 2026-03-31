import prisma from '../../prisma/prisma';
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

export class ArticleRepo {
  /**
   * 게시글 존재 여부 확인
   * @param articleId - 게시글 ID
   * @returns 게시글이 존재하면 해당 게시글 객체 반환
   */
  findArticle = async (articleId: bigint) => {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    return article;
  };

  // 게시글 목록 조회 옵션
  getArticlesOption = (page: number, limit: number, keyword: string | undefined) => {
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
  };

  /**
   * 게시글 목록 조회 리포지토리
   * @param page - 페이지 번호
   * @param limit - 페이지당 게시글 수
   * @param keyword - 검색 키워드 (제목 또는 내용에 포함된 경우)
   * @param userId - 로그인한 유저의 ID (좋아요 여부 판단을 위해 사용)
   * @returns 게시글 목록 및 전체 게시글 수
   */
  getArticles = async (
    page: number,
    limit: number,
    keyword: string | undefined,
    userId: bigint | null,
  ) => {
    const findOption = this.getArticlesOption(page, limit, keyword);

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

  /**
   * 게시글 상세 조회 리포지토리
   * @param articleId - 게시글 ID
   * @param userId - 로그인한 유저의 ID (좋아요 여부 판단을 위해 사용)
   * @returns 게시글 상세 정보
   */
  getDetailArticle = async (articleId: bigint, userId: bigint | null) => {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    return article;
  };

  /**
   * 게시글 생성 리포지토리
   * @param userId - 게시글 작성자 ID
   * @param dto - 게시글 생성 DTO
   * @returns 생성된 게시글 엔티티
   */
  createArticle = async (userId: bigint, dto: CreateArticleDto) => {
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

  /**
   * 게시글 수정 리포지토리
   * @param articleId - 수정할 게시글 ID
   * @param dto - 게시글 수정 DTO
   * @returns 수정된 게시글 엔티티
   */
  updateArticle = async (articleId: bigint, dto: UpdateArticleDto) => {
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

  /**
   * 게시글 삭제 리포지토리
   * @param articleId - 삭제할 게시글 ID
   * @returns 삭제 성공 시 반환값 없음
   */
  deleteArticle = async (articleId: bigint) => {
    await prisma.article.delete({
      where: { id: articleId },
    });
  };

  /**
   * 게시글 댓글 생성 리포지토리
   * @param articleId - 게시글 ID
   * @param userId - 유저 ID
   * @param dto - 댓글 생성 DTO
   * @returns 생성된 댓글 엔티티
   */
  createArticleCommnet = async (articleId: bigint, userId: bigint, dto: CommentDto) => {
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
  /**
   * 게시글 댓글 조회 리포지토리
   * @param articleId - 게시글 ID
   * @param limit - 페이지당 댓글 수
   * @param cursor - 커서 (이전 요청에서 받은 다음 커서)
   * @returns 댓글 목록
   */
  getArticleComments = async (articleId: bigint, limit: number, cursor: bigint | undefined) => {
    const comments = await prisma.comment.findMany(
      cursorPaginationOption({
        cursor: cursor,
        limit: limit + 1,
        where: { articleId },
      }),
    );

    return comments;
  };
}
