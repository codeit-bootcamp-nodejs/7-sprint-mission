export class ProductList {
  constructor(id, name, price, createdAt) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new ProductList(
      entity.id.toString(),
      entity.name,
      entity.price,
      entity.createdAt.toISOString(),
    );
  }
}

// 상품 상세 조회용
export class ProductDetail {
  constructor(id, name, description, price, tags, images, createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new ProductDetail(
      entity.id.toString(),
      entity.name,
      entity.description,
      entity.price,
      entity.tags,
      entity.images,
      entity.createdAt.toISOString(),
    );
  }
}
