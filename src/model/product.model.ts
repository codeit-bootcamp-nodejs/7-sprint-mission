import type { Product as PrismaProduct } from '@prisma/client';

// 1. 상품 리스트용 (목록 조회 시 필요한 최소 정보)
export class ProductList {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public createdAt: string,
  ) {}

  static fromEntity(entity: PrismaProduct) {
    return new ProductList(
      entity.id.toString(),
      entity.name,
      entity.price,
      entity.createdAt.toISOString(),
    );
  }
}

// 2. 상품 상세 조회용 (전체 필드 포함)
export class ProductDetail {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public tags: string[],
    public images: string[],
    public createdAt: string,
    public userId: string,
  ) {}

  static fromEntity(entity: PrismaProduct) {
    return new ProductDetail(
      entity.id.toString(),
      entity.name,
      entity.description,
      entity.price,
      entity.tags, // 스키마상 String[]이므로 그대로 대입
      entity.images, // 스키마상 String[]이므로 그대로 대입
      entity.createdAt.toISOString(),
      entity.userId.toString(), // BigInt이므로 문자열 변환
    );
  }
}
