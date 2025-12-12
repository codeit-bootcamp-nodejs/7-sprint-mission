import { BadRequestError } from "../../../errors/customErrors.js";
import { validateCreateAt } from "../../../utils/validateCreatedAt.js";
import { validateStringId } from "../../../utils/validateStringId.js";

const validateTitle = (title) => {
  if (!title) throw new Error("Falsy title");
  if (title.length > 255) {
    throw new BadRequestError(`Title too long ${title.length}`);
  }
};

const validateIContent = (content) => {
  if (!content) throw new Error("Falsy content");
  if (content.length > 10000) {
    throw new BadRequestError(`Content too long ${content.length}`);
  }
};

const validateArticleInfo = ({ id, title, content, createdAt }) => {
  validateStringId(id);
  validateTitle(title);
  validateIContent(content);
  validateCreateAt(createdAt);
};

const validateUnregisteredArticleInfo = ({ title, content }) => {
  validateTitle(title);
  validateIContent(content);
};

export class Article {
  constructor({ id, title, content, createdAt }) {
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

    return new Article(info);
  }
}

export class UnregisteredArticle {
  constructor({ title, content }) {
    this.title = title;
    this.content = content;
  }

  static fromInfo({ title, content }) {
    const info = {
      title,
      content,
    };

    validateUnregisteredArticleInfo(info);

    return new UnregisteredArticle(info);
  }
}
