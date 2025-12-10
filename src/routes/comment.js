export class ArticleComment {
  constructor(id, content, createAt) {
    this.id = id;
    this.content = content;
    this.createAt = createAt;
  }

  static fromEntity(entity) {
    const { id, content, created_at } = entity;
    return new ArticleComment(id.toString(), content, created_at);
  }
}

export class ProductComment {
  constructor(id, content, createAt) {
    this.id = id;
    this.content = content;
    this.createAt = createAt;
  }

  static fromEntity(entity) {
    const { id, content, created_at } = entity;
    return new ProductComment(id.toString(), content, created_at);
  }
}
