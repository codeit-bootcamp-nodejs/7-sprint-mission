import { HTTPError } from "../error.js";

export class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static validateId(id) {
    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }
  }

  static validateTitle(title) {
    if (!title || typeof title !== "string") {
      throw new HTTPError(400, "Title is required and must be a string");
    }
  }

  static validateContent(content) {
    if (!content || typeof content !== "string") {
      throw new HTTPError(400, "Content is required and must be a string");
    }
  }

  static validateCreate(body) {
    Article.validateTitle(body.title);
    Article.validateContent(body.content);
  }

  static validateUpdate(body) {
    if (body.title !== undefined) Article.validateTitle(body.title);
    if (body.content !== undefined) Article.validateContent(body.content);
  }

  validate() {
    Article.validateTitle(this.title);
    Article.validateContent(this.content);
  }

  static fromEntity(entity) {
    const article = new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.created_at
    );
    article.validate();
    return article;
  }
}

export default Article;
