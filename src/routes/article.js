import { BadRequestError, NotFoundError } from "../errors/customError.js";

class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity({ id, title, content, created_at }) {
    const info = {
      id: id.toString(),
      title,
      content,
      createdAt: created_at,
    };
    validateArticleInfo(info);

    return new Article(info.id, info.title, info.content, info.createdAt);
  }
}

function validateId(id) {
  if (typeof id !== "string") {
    throw new Error(`Invalid id type ${typeof id}`);
  }
}

function validateTitle(title) {
  if (title.length > 255) {
    throw new BadRequestError();
  }
}

function validateContent(content) {
  if (content.length > 10000) {
    throw new Error(`Content too long ${content.length}`);
  }
}

function validateCreateAt(createat) {
  if (new Date("2024-01-01") > createat) {
    throw new Error(`Invalid createAT ${createat.toString()}`);
  }
}

function validateArticleInfo({ id, title, content, createdAt }) {
  validateId(id);
  validateTitle(title);
  validateContent(content);
  validateCreateAt(createdAt);
}

export default Article;
