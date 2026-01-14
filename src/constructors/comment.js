export class Comment {
  constructor(id, content, createdAt, productId = null, articleId = null) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.productId = productId;
    this.articleId = articleId;
  }

  static fromEntity(entity) {
    return new Comment(
      entity.id.toString(),
      entity.content,
      entity.created_at,
      entity.product_id ? entity.product_id.toString() : null,
      entity.article_id ? entity.article_id.toString() : null
    );
  }
}
