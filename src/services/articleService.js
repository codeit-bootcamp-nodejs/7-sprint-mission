import { prisma } from "../../prisma/prisma.js";

// Article DTO
class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.created_at
    );
  }
}

/**
 * 게시글 목록 및 전체 개수를 조회하는 서비스 함수
 * @param {number} limit - 페이지당 조회 개수
 * @param {number} offset - 건너뛸 개수
 * @param {string} keyword - 검색 키워드 (선택적)
 * @returns {{articles: Article[], totalCount: number}}
 */
export async function getArticleList(limit, offset, keyword) {
  const findOption = {
    orderBy: { created_at: "desc" },
    take: limit,
    skip: offset,
  };

  if (keyword) {
    findOption.where = {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }

  // 게시글 목록과 전체 개수를 병렬로 조회
  const [entities, totalCount] = await prisma.$transaction([
    prisma.article.findMany(findOption),
    prisma.article.count({ where: findOption.where }),
  ]);

  const articles = entities.map(Article.fromEntity);

  return { articles, totalCount };
}

export async function createArticleComment(articleId, content) {
  const newComment = await prisma.article_comment.create({
    data: {
      article_id: BigInt(articleId),
      content: content,
    },
  });
  return newComment;
}
