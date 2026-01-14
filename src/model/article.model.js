class Article {
  constructor(id, title, content, image, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.image ?? null,
      entity.createdAt.toISOString(),
    );
  }
}

export default Article;
