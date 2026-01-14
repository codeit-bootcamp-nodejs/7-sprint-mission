export class Product {
  constructor(id, name, description, price, tags, createdAt, isLiked = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
    this.isLiked = isLiked;
  }

  static fromEntity(entity) {
    const isLiked = Array.isArray(entity.likes) && entity.likes.length > 0;

    return new Product(
      entity.id.toString(),
      entity.name,
      entity.description,
      entity.price,
      entity.tags,
      entity.created_at,
      isLiked
    );
  }
}
