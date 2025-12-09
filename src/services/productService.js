import { prisma } from "../../prisma/prisma.js";

// Product DTO 정의
class Product {
  constructor(id, name, description, price, tags, createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Product(
      entity.id.toString(),
      entity.name,
      entity.description,
      entity.price,
      entity.tags,
      entity.created_at
    );
  }
}

/**
 * 상품 목록 및 전체 개수를 조회하는 서비스 함수
 * @param {number} limit - 페이지당 조회 개수
 * @param {number} offset - 건너뛸 개수
 * @param {string} keyword - 검색 키워드 (선택적)
 * @returns {{products: Product[], totalCount: number}}
 */
export async function getProductList(limit, offset, keyword) {
  const findOption = {
    orderBy: { created_at: "desc" }, // 3. 최신순 정렬 적용
    take: limit, // 2. limit 적용
    skip: offset, // 2. offset 적용
  };

  if (keyword) {
    findOption.where = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }

  // 상품 목록과 전체 개수를 병렬로 조회
  const [entities, totalCount] = await prisma.$transaction([
    prisma.product.findMany(findOption),
    // count는 limit, offset, orderBy 옵션을 제외하고 where 조건만 적용해야 합니다.
    prisma.product.count({ where: findOption.where }),
  ]);

  const products = entities.map(Product.fromEntity);

  return { products, totalCount };
}

export async function createProductComment(productId, content) {
  const newComment = await prisma.product_comment.create({
    data: {
      product_id: BigInt(productId),
      content: content,
    },
  });
  return newComment;
}
