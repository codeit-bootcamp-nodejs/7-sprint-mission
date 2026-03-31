import { NotFoundError } from '../errors/notFoundError';
import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { UnauthenticatedError } from '../errors/unauthenticatedError';
import type { ChangePasswordDto, UpdateUserDto } from '../types/user.type';

export class UserController {
  private userService = new UserService();

  //프로필 조회 컨트롤러
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = BigInt(req.user!.userId);

      const profile = await this.userService.getProfile(userId);

      res.status(200).json({ message: '유저 정보를 성공적으로 조회하였습니다.', data: profile });
    } catch (e) {
      next(e);
    }
  };

  //유저 정보 갱신 컨트롤러
  updateProfile = async (
    req: Request<{}, {}, UpdateUserDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = BigInt(req.user!.userId);
      const file = req.file as Express.MulterS3.File;
      const updateDto: UpdateUserDto = {
        ...req.body,
        ...(file && { image: file.location }),
      };
      const updatedUser = await this.userService.updateProfile(userId, updateDto);

      res
        .status(200)
        .json({ message: '유저 정보가 성공적으로 수정되었습니다.', data: updatedUser });
    } catch (e) {
      next(e);
    }
  };

  //비밀번호 변경 컨트롤러
  changePassword = async (
    req: Request<{}, {}, ChangePasswordDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        throw new UnauthenticatedError('유저 정보를 찾을 수 없습니다.');
      }
      const userId = BigInt(req.user.userId);

      await this.userService.changePassword(userId, req.body);

      res.status(200).json({ message: '비밀번호를 성공적으로 변경하였습니다.' });
    } catch (e) {
      next(e);
    }
  };

  //사용자가 작성한 상품 목록 조회 컨트롤러
  getUserProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthenticatedError('유저 정보를 찾을 수 없습니다.');
      }
      const userId = BigInt(req.user.userId);

      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const { myProductList, totalCount } = await this.userService.getUserProducts(
        userId,
        page,
        limit,
      );

      res.status(200).json({
        message: '등록한 상품 목록 조회를 성공하였습니다.',
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

  //유저가 좋아요한 상품 목록 조회 컨트롤러
  getLikedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new NotFoundError('유저 정보를 찾을 수 없습니다.');
      }
      const userId = BigInt(req.user.userId);
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const { likeProducts, totalCount } = await this.userService.getLikedProducts(
        userId,
        page,
        limit,
      );

      res.status(200).json({
        message: '좋아요한 상품 목록 조회 성공',
        data: likeProducts,
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

  // 유저가 좋아요한 게시글 목록 조회 컨트롤러
  getLikedArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new NotFoundError('유저 정보를 찾을 수 없습니다.');
      }
      const userId = BigInt(req.user.userId);
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const { likeArticles, totalCount } = await this.userService.getLikedArticles(
        userId,
        page,
        limit,
      );

      res.status(200).json({
        message: '좋아요한 게시글 목록 조회 성공',
        data: likeArticles,
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
}
