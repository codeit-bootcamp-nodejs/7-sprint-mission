import prisma from '../../prisma/prisma.js';
import bcrypt from 'bcrypt';
import { NotFoundError } from '../errors/notFoundError.js';
import { ForbiddenError } from '../errors/forbiddenError.js';
import User from '../model/user.model.js';
import { ProductList } from '../model/product.model.js';
import Article from '../model/article.model.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const entity = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!entity) {
      throw new NotFoundError('유저 정보를 찾을 수 없습니다.');
    }

    const profile = User.fromEntity(entity);
    res.status(200).json({ message: '유저 정보를 찾았습니다.', data: profile });
  } catch (e) {
    next(e);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);
    const { nickname } = req.body;
    const image = req.file ? `/uploads/user/${req.file.filename}` : undefined;

    const updateEntity = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nickname !== undefined && { nickname }),
        ...(image !== undefined && { image }),
      },
    });
    const updated = User.fromEntity(updateEntity);
    res.status(200).json({ message: '유저 정보 수정 성공', data: updated });
  } catch (e) {
    next(e);
  }
};

export const changeMyPassword = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new ForbiddenError('기존 비밀번호가 일치하지 않습니다.');
    }

    const saltedHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: saltedHash },
    });

    res.status(200).json({ message: '비밀번호 변경 성공.' });
  } catch (e) {
    next(e);
  }
};

export const getMyProduct = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);

    const page = (Number(req.query.page ?? 1), 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const [product, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { userId } }),
    ]);

    const myProductList = product.map(ProductList.fromEntity);

    res.status(200).json({
      message: '상품 목록 조회에 성공하였습니다.',
      data: myProductList,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (e) {
    next(e);
  }
};

export const getMyLikedProducts = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);

    const likedProduct = await prisma.productLike.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    const product = likedProduct.map((like) => ({
      ...ProductList.fromEntity(like.product),
      isLiked: true,
    }));

    res.status(200).json({
      message: '좋아요한 상품 목록 조회 성공',
      data: product,
    });
  } catch (e) {
    next(e);
  }
};

export const getMyLikedArticles = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.userId);

    const likedArticle = await prisma.articleLike.findMany({
      where: { userId },
      include: {
        article: true,
      },
    });

    const article = likedArticle.map((like) => ({
      ...Article.fromEntity(like.article),
      isLiked: true,
    }));

    res.status(200).json({
      message: '좋아요한 게시글 목록 조회 성공',
      data: article,
    });
  } catch (e) {
    next(e);
  }
};
