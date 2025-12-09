export class ArticleComment {
  constructor(id, content, createdAt) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
  }
  static fromEntity(entity) {
    return new ArticleComment(
      entity.id.toString(),
      entity.content,
      entity.created_at
    );
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
    return new ProductComment(
      entity.id.toString(),
      entity.content,
      entity.created_at
    );
  }
}
