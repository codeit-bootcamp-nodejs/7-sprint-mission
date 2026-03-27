export interface ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  favoriteCount: number;
  isLiked: boolean;
  authorId: number;
  author: { id: number; nickname: string; image: string | null };
  createdAt: Date;
  updatedAt: Date;
}

export function toProductDto(
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    author: { id: number; nickname: string; image: string | null };
    _count: { likes: number };
  },
  isLiked = false
): ProductResponseDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    images: product.images,
    favoriteCount: product._count.likes,
    isLiked,
    authorId: product.authorId,
    author: product.author,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
