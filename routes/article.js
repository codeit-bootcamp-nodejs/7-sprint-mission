// 유효성 검사 파일.
export class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  // 파라미터 entity는 db객체를 끌어다 가져오는 파라미터임.
  // 그래서 가져온 db객체를 변환해주는 역할.
  static fromEmtity({ id, title, content, created_at }) {
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

export class UnregisteredArticle {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }

  static fromInfo({ title, content }) {
    const info = {
      title,
      content,
    };
    validateUnregisteredArticleInfo(info);
    return new UnregisteredArticle(info.title, info.content);
  }
}

function validateId(id) {
  if (typeof id !== "string") {
    throw new Error(`Invalid id type ${typeof id}`);
  }
}

function validateTitle(title) {
  if (!title) throw new Error("Falsy title");
  if (title.length > 255) {
    throw new Error(`Title too long ${title.length}`);
  }
}

function validateContent(content) {
  if (!content) throw new Error("Falsy content");
  if (content.length > 10000) {
    throw new Error(`Contnet too long ${content.length}`);
  }
}

function validateCreateAt(createat) {
  if (new Date("2024-01-01") > createat) {
    throw new Error(`Invalid createAt ${createat.toString()}`);
  }
}

function validateArticleInfo({ id, title, content, created_at }) {
  validateId(id);
  validateTitle(title);
  validateContent(content);
  validateCreateAt(created_at);
}

function validateUnregisteredArticleInfo({ title, content }) {
  validateTitle(title);
  validateContent(content);
}
