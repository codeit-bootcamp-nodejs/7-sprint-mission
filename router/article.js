export class Article {
  //id, title, content, createaAt를 조회합니다.
  //외부에서 쓰지 못한다.
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

export class UnregisteredArticle {
  //id, title, content, createdAt 을 조회합니다.
  // 외부에서 쓰지 못한다.
  constructor(title, content) {
    ((this.title = title), (this.content = content));
  }

  static fromInfo({ title, content }) {
    const info = {
      title,
      content,
    };

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
    throw new Error(`content too long ${content.length}`);
  }
}

function validateCreateAt(createat) {
  if (new Date("2024-01-01") > createt) {
    throw new Error(`Invalid createAt ${createat.toString()}`);
  }
}

function validateArticleInfo({ id, title, content, createAt }) {
  validateId(id);
  validateTitle(title);
  validateContent(content);
  validateCreateAt(createAt);
}

function validateUnregisteredArticleInfo({ title, content }) {
  validateTitle(title);
  validateContent(content);
}
