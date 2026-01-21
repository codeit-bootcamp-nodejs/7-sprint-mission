export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  createdAt: Date;
  isLiked: boolean;

  constructor(
    id: string, 
    name: string, 
    description: string, 
    price: number, 
    tags: string[], 
    createdAt: Date, 
    isLiked = false
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
    this.isLiked = isLiked;
  }

  static fromEntity(entity: {
    id:   bigint;
    name: string;
    description: string | null;
    price: number;
    tags: string[];
    created_at: Date;
    likes?: Array<{ id: bigint }>;
  }): Product {
    const isLiked = Array.isArray(entity.likes) && entity.likes.length > 0;

    return new Product(
      entity.id.toString(),
      entity.name,
      entity.description ?? "",
      entity.price,
      entity.tags,
      entity.created_at,
      isLiked
    );
  }
}
