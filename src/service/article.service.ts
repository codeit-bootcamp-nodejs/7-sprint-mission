import Article from '../model/article.model';
import Comment from '../model/comment.model';
import { NotFoundError } from '../errors/notFoundError';
import { ForbiddenError } from '../errors/forbiddenError';
import type { CreateArticleDto, UpdateArticleDto } from '../types/article.type';
import type { CommentDto } from '../types/comment.type';
import { ArticleRepo } from '../repository/article.repository';
import { eventEmitter } from '../event';

export class ArticleService {
  private articleRepo = new ArticleRepo();

  /**
   * 게시글 소유자 검증
   */
  validateOwner = async (articleId: bigint, userId: bigint): Promise<void> => {
    const article = await this.articleRepo.findArticle(articleId);
    if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다.');
    if (article.userId !== userId) throw new ForbiddenError('권한이 없습니다.');
  };

  /**
   * 게시글 목록 조회 서비스
   * @param page - 페이지 번호 (기본값: 1)
   * @param limit - 페이지당 게시글 수 (기본값: 10, 최대값: 50)
   * @param keyword - 검색 키워드 (제목 또는 내용에 포함된 경우)
   * @param userId - 로그인한 유저의 ID (좋아요 여부 판단을 위해 사용)
   * @returns 게시글 목록과 전체 게시글 수
   * @description
   * 1. 페이지네이션과 키워드 검색을 지원합니다.
   * 2. 로그인한 유저가 좋아요한 게시글인지 여부를 함께 반환합니다.
   */
  getArticles = async (
    page: number,
    limit: number,
    keyword: string | undefined,
    userId: bigint | null,
  ) => {
    const { entities, totalCount } = await this.articleRepo.getArticles(
      page,
      limit,
      keyword,
      userId,
    );

    const articles = entities.map((entity) => ({
      ...Article.fromEntity(entity),
      isLiked: userId ? (entity.likes.length ?? 0) > 0 : false,
    }));

    return { articles, totalCount };
  };

  /**
   * 게시글 상세 조회 서비스
   * @param articleId - 게시글 ID
   * @param userId - 로그인한 유저의 ID (좋아요 여부 판단을 위해 사용)
   * @returns 게시글 상세 정보
   * @desctiption
   * 1. 게시글 ID로 게시글을 조회하며, 존재하지 않을 경우 NotFoundError를 던집니다.
   * 2. 로그인한 유저가 좋아요한 게시글인지 여부를 함께 반환합니다.
   */
  getArticleDetail = async (articleId: bigint, userId: bigint | null) => {
    const entity = await this.articleRepo.getDetailArticle(articleId, userId);

    if (!entity) {
      throw new NotFoundError('해당 게시물을 찾을 수 없습니다.');
    }

    const isLiked = userId ? entity.likes.length > 0 : false;

    const article = Article.fromEntity(entity);
    return {
      article: { ...article, isLiked },
    };
  };

  /**
   * 게시글 생성 서비스
   * @param dto - 게시글 생성 DTO
   * @param userId - 유저 ID
   * @returns 생성된 게시글 정보
   * @description 로그인한 유저가 게시글을 작성할 수 있도록 하며, 생성된 게시글 정보를 반환합니다.
   */
  createArticle = async (dto: CreateArticleDto, userId: bigint) => {
    const entity = await this.articleRepo.createArticle(userId, dto);

    return Article.fromEntity(entity);
  };

  /**
   * 게시글 수정 서비스
   * @param {bigint} articleId - 게시글 ID
   * @param {bigint} userId - 유저 ID
   * @param {UpdateArticleDto} dto - 게시글 수정 DTO
   * @returns {Promise<Article>} 수정된 게시글 정보
   * @description 로그인한 유저가 본인의 게시글만 수정할 수 있도록 하며, 수정된 게시글 정보를 반환합니다.
   */
  updateArticle = async (articleId: bigint, userId: bigint, dto: UpdateArticleDto) => {
    await this.validateOwner(articleId, userId);

    const entity = await this.articleRepo.updateArticle(articleId, dto);

    const updateArticle = Article.fromEntity(entity);

    return updateArticle;
  };

  /**
   * 게시글 삭제 서비스
   * @param articleId - 게시글 ID
   * @param userId - 유저 ID
   * @returns 삭제 성공시 반환값 없음
   * @description 로그인한 유저가 본인의 게시글만 삭제할 수 있도록 하며, 성공 시 리턴값 없음
   */
  deleteArticle = async (articleId: bigint, userId: bigint): Promise<void> => {
    await this.validateOwner(articleId, userId);

    await this.articleRepo.deleteArticle(articleId);
  };

  /**
   * 게시글 댓글 작성 서비스
   * @param articleId - 게시글 ID
   * @param userId - 유저 ID
   * @param dto - 댓글 생성 DTO
   * @returns 생성된 댓글 정보
   * @description 로그인한 유저가 게시글에 댓글을 작성할 수 있도록 하며, 생성된 댓글 정보를 반환합니다.
   */
  createArticleComment = async (articleId: bigint, userId: bigint, dto: CommentDto) => {
    const article = await this.articleRepo.findArticle(articleId);
    if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다.');

    const comment = await this.articleRepo.createArticleCommnet(articleId, userId, dto);

    // 댓글 작성 시 게시글 작성자에게 알림 전송
    if (article.userId !== userId) {
      eventEmitter.emit('articleCommentCreated', { article, articleId });
    }

    return Comment.fromEntity(comment);
  };

  /**
   * 게시글 댓글 목록 조회 서비스
   * @param articleId - 게시글 ID
   * @param cursor - 커서 (이전 요청에서 받은 다음 커서)
   * @param limit - 한 번에 조회할 댓글 수
   * @returns 댓글 목록과 다음 커서 정보
   */
  getArticleComments = async (articleId: bigint, cursor: bigint | undefined, limit: number) => {
    const article = await this.articleRepo.findArticle(articleId);
    if (!article) throw new NotFoundError('해당 게시물을 찾을 수 없습니다.');

    const entities = await this.articleRepo.getArticleComments(articleId, limit, cursor);

    const hasNextPage = entities.length > limit;

    // 실제로 반환할 데이터 슬라이싱
    const commentsToReturn = hasNextPage ? entities.slice(0, limit) : entities;

    const nextCursor = hasNextPage
      ? commentsToReturn[commentsToReturn.length - 1]?.id.toString()
      : null;

    const comments = commentsToReturn.map((entity) => Comment.fromEntity(entity));

    return { comments, nextCursor };
  };
}
