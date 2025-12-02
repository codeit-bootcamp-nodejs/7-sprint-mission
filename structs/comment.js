import { HTTPError } from "../error.js";

export class Comment {
  constructor(id, content, productId, articleId, createdAt, updatedAt) {
    this.id = id;
    this.content = content;
    this.productId = productId;
    this.articleId = articleId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validateContent(content) {
    if (!content || typeof content !== "string") {
      throw new HTTPError(400, "Content is required and must be a string");
    }
  }

  validate() {
    this.validateContent(this.content);
  }

  static fromEntity(entity) {
    const comment = new Comment(
      entity.id.toString(),
      entity.content,
      entity.productId ? entity.productId.toString() : null,
      entity.articleId ? entity.articleId.toString() : null,
      entity.created_at,
      entity.updated_at
    );
    comment.validate();
    return comment;
  }
}

export default Comment;
