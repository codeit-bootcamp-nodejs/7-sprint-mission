import { HTTPError } from "../error.js";

export class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  validateTitle(title) {
    if (!title || typeof title !== "string") {
      throw new HTTPError(400, "Title is required and must be a string");
    }
  }

  validateContent(content) {
    if (!content || typeof content !== "string") {
      throw new HTTPError(400, "Content is required and must be a string");
    }
  }

  validate() {
    this.validateTitle(this.title);
    this.validateContent(this.content);
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
