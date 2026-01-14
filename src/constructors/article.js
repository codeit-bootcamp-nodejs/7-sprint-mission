export class Article {
  constructor(id, title, content, createdAt, isLiked = false) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.isLiked = isLiked;
  }

  static fromEntity(entity) {
    const isLiked = Array.isArray(entity.likes) && entity.likes.length > 0;

    return new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.created_at,
      isLiked
    );
  }
}
