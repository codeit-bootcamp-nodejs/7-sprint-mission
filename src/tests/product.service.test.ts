import { ProductService } from '../service/product.service';
import { ProductRepo } from '../repository/product.repository';
import { ProductDetail } from '../model/product.model';
import { NotFoundError } from '../errors/notFoundError';
import { ForbiddenError } from '../errors/forbiddenError';
import { CreateProductDto, UpdateProductDto } from '../types/product.type';
import { Product as PrismaProduct } from '@prisma/client';
import { eventEmitter } from '../event';

jest.mock('../repository/product.repository');
jest.mock('../event', () => ({
  eventEmitter: {
    emit: jest.fn(),
  },
}));

interface PrismaLike {
  id: bigint;
  createdAt: Date;
  userId: bigint;
  productId: bigint;
}

interface PrismaProductWithLikes extends PrismaProduct {
  likes: PrismaLike[];
}

describe('ProductService Unit Test', () => {
  let productService: ProductService;
  let mockRepo: jest.Mocked<ProductRepo>;

  const userId = BigInt(1);
  const productId = BigInt(100);

  const createMockPrismaProduct = (overrides?: Partial<PrismaProduct>): PrismaProduct =>
    ({
      id: productId,
      name: '테스트 상품',
      description: '테스트 설명',
      price: 10000,
      image: null,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    }) as PrismaProduct;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepo = {
      getProductList: jest.fn(),
      getProductDetail: jest.fn(),
      findDetailProduct: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductRepo>;

    (ProductRepo as jest.Mock).mockImplementation(() => mockRepo);
    productService = new ProductService();
  });

  describe('createProduct', () => {
    it('상품 생성 성공 시 ProductDetail 모델을 반환해야 한다', async () => {
      const dto: CreateProductDto = {
        name: '신상품',
        description: '설명',
        price: 20000,
        tags: [],
      };
      const mockEntity = createMockPrismaProduct({ ...dto });

      mockRepo.createProduct.mockResolvedValue(mockEntity);

      const result = await productService.createProduct(userId, dto);

      expect(mockRepo.createProduct).toHaveBeenCalledWith(userId, dto);
      expect(result.name).toBe('신상품');
      expect(result).toBeInstanceOf(ProductDetail);
    });
  });

  describe('getProductList', () => {
    it('상품 목록과 totalCount를 반환하며 좋아요 여부를 포함해야 한다', async () => {
      const entityWithLikes: PrismaProductWithLikes = {
        ...createMockPrismaProduct(),
        likes: [{ id: BigInt(1), createdAt: new Date(), userId, productId }],
      };

      mockRepo.getProductList.mockResolvedValue({
        entities: [entityWithLikes] as unknown as (PrismaProduct & { likes: PrismaLike[] })[],
        totalCount: 1,
      });

      const result = await productService.getProductList(10, 1, userId, undefined);

      expect(result.products[0]!.isLiked).toBe(true);
      expect(result.totalCount).toBe(1);
    });
  });

  describe('getProductDetail', () => {
    it('상품이 없으면 NotFoundError를 던져야 한다', async () => {
      mockRepo.getProductDetail.mockResolvedValue(null);

      await expect(productService.getProductDetail(productId, userId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('상품 상세 정보와 좋아요 여부를 반환해야 한다', async () => {
      const entityWithLikes: PrismaProductWithLikes = {
        ...createMockPrismaProduct(),
        likes: [],
      };
      mockRepo.getProductDetail.mockResolvedValue(
        entityWithLikes as unknown as PrismaProduct & { likes: PrismaLike[] },
      );

      const result = await productService.getProductDetail(productId, userId);

      expect(result.isLiked).toBe(false);
      expect(result.id).toBe(productId.toString());
    });
  });

  describe('updateProduct', () => {
    const updateDto: UpdateProductDto = { name: '수정 상품', price: 15000 };

    it('가격이 수정되면 productPriceChanged 이벤트를 발생시켜야 한다', async () => {
      mockRepo.findDetailProduct.mockResolvedValue(createMockPrismaProduct());

      mockRepo.updateProduct.mockResolvedValue(createMockPrismaProduct({ ...updateDto }));

      const result = await productService.updateProduct(productId, userId, updateDto);

      expect(eventEmitter.emit).toHaveBeenCalledWith('productPriceChanged', expect.anything());
      expect(result.name).toBe('수정 상품');
    });

    it('권한이 없는 유저가 수정 시 ForbiddenError를 던져야 한다', async () => {
      mockRepo.findDetailProduct.mockResolvedValue(
        createMockPrismaProduct({ userId: BigInt(999) }),
      );

      await expect(productService.updateProduct(productId, userId, updateDto)).rejects.toThrow(
        ForbiddenError,
      );
    });
  });

  describe('deleteProduct', () => {
    it('소유자 확인 후 상품을 삭제해야 한다', async () => {
      mockRepo.findDetailProduct.mockResolvedValue(createMockPrismaProduct());
      mockRepo.deleteProduct.mockResolvedValue(undefined as unknown as void);

      await productService.deleteProduct(productId, userId);

      expect(mockRepo.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });
});
