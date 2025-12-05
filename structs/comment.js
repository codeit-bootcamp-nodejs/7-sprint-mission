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

  static validateId(id) {
    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }
  }

  static validateContent(content) {
    if (!content || typeof content !== "string") {
      throw new HTTPError(400, "Content is required and must be a string");
    }
  }

  static validateCreate(body) {
    Comment.validateContent(body.content);
  }

  static validateUpdate(body) {
    if (body.content !== undefined) Comment.validateContent(body.content);
  }

  validate() {
    Comment.validateContent(this.content);
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
