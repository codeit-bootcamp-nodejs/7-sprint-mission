import { validateCreateAt } from "../../../utils/validateCreatedAt.js";
import { validateStringId } from "../../../utils/validateStringId.js";

const validateContent = (content) => {
  if (typeof content !== "string") {
    throw new Error(`Invalid content type ${typeof content}`);
  }
  if (content.length > 255) {
    throw new Error(`Title too long ${content.length}`);
  }
};

const validateArticleCommentInfo = ({ id, content, createdAt }) => {
  validateStringId(id);
  validateContent(content);
  validateCreateAt(createdAt);
};

export class ArticleComment {
  constructor({ id, content, createdAt, articleId }) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.articleId = articleId;
  }

  static fromEntity({ id, content, created_at, article_id }) {
    const info = {
      id: id.toString(),
      content,
      createdAt: created_at,
      articleId: article_id,
    };

    validateArticleCommentInfo(info);

    return new ArticleComment(info);
  }
}
