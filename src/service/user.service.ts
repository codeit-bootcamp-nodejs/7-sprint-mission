import { ProductList } from '../model/product.model';
import Article from '../model/article.model';
import { NotFoundError } from '../errors/notFoundError';
import { ForbiddenError } from '../errors/forbiddenError';
import User from '../model/user.model';
import type { ChangePasswordDto, UpdateUserDto } from '../types/user.type';
import bcrypt from 'bcrypt';
import {
  changePasswordRepo,
  findUser,
  findUserWithPassword,
  getMyLikedArticlesRepo,
  getMyLikedProductsRepo,
  getMyProductRepo,
  updateUserRepo,
} from '../repository/user.repository';
import { ValidationError } from '../errors/validationError';

//프로필 조회 서비스
export const getMyProfileService = async (userId: bigint) => {
  const entity = await findUser(userId);
  if (!entity) throw new NotFoundError('유저 정보를 찾을 수 없습니다.');

  const profile = User.fromEntity(entity);
  return profile;
};

//유저 정보 갱신 서비스
export const updateUserService = async (userId: bigint, dto: UpdateUserDto) => {
  const entity = await updateUserRepo(userId, dto);

  return User.fromEntity(entity);
};

//비밀번호 변경 서비스
export const ChangePasswordService = async (
  userId: bigint,
  dto: ChangePasswordDto,
): Promise<void> => {
  const { currentPassword, newPassword } = dto;
  const user = await findUserWithPassword(userId);
  if (!user) throw new NotFoundError('유저 정보를 찾을 수 없습니다.');

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) throw new ForbiddenError('기존 비밀번호와 일치하지 않습니다.');

  const isSameAsOld = await bcrypt.compare(newPassword, user.password);
  if (!isSameAsOld) {
    throw new ValidationError('새 비밀번호는 이전 비밀번호와 다르게 설정해야 합니다.');
  }
  const saltedHash = await bcrypt.hash(newPassword, 10);

  await changePasswordRepo(userId, saltedHash);
};

//사용자가 작성한 상품 목록 조회 서비스
export const getMyProductService = async (userId: bigint, page: number, limit: number) => {
  const { product, totalCount } = await getMyProductRepo(userId, page, limit);

  const myProductList = product.map(ProductList.fromEntity);

  return { myProductList, totalCount };
};

//유저가 좋아요한 상품 목록 조회 서비스
export const getMyLikedProductService = async (userId: bigint, page: number, limit: number) => {
  const { products, totalCount } = await getMyLikedProductsRepo(userId, page, limit);

  const likeProducts = products.map((like) => ({
    ...ProductList.fromEntity(like.product),
    isLiked: true,
  }));

  return { likeProducts, totalCount };
};

// 유저가 좋아요한 게시글 목록 조회 서비스
export const getMyLikedArticleService = async (userId: bigint, page: number, limit: number) => {
  const { articles, totalCount } = await getMyLikedArticlesRepo(userId, page, limit);

  const likeArticles = articles.map((like) => ({
    ...Article.fromEntity(like.article),
    isLiked: true,
  }));

  return { likeArticles, totalCount };
};
