export class ArticleComment {
  constructor(id, content, createdAt) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    const { id, content, created_at } = entity;
    return new ArticleComment(id.toString(), content, created_at);
  }
}

export class ProductComment {
  constructor(id, content, createdAt) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    const { id, content, created_at } = entity;
    return new ProductComment(id.toString(), content, created_at);
  }
}
