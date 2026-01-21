import { Request, Response } from 'express';
import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import {
  ChangePasswordBodyStruct,
  UpdateUserBodyStruct,
  UpdateUserBody,
  ChangePasswordBody,
} from '../structs/userStructs.js';

export async function getUserMe(req: Request, res: Response) {
  const { password, refreshToken, ...userWithoutPassword } = req.user!;

  return res.status(200).json(userWithoutPassword);
}

//정보 수정
export async function updateUserMe(req: Request, res: Response) {
  const { nickname, image } = create(req.body, UpdateUserBodyStruct) as UpdateUserBody;
  const updateUser = await prismaClient.user.update({
    where: { id: req.user!.id },
    data: { nickname, image },
  });
  const { password, refreshToken, ...userWithoutPassword } = updateUser;
  return res.status(200).json(userWithoutPassword);
}

//비밀번호 변경
export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = create(
    req.body,
    ChangePasswordBodyStruct,
  ) as ChangePasswordBody;
  //비밀번호 일치 확인
  const passwordValid = await bcrypt.compare(currentPassword, req.user!.password);
  if (!passwordValid) {
    throw new BadRequestError('비밀번호가 일치하지 않습니다.');
  }
  //새 비밀번호
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prismaClient.user.update({
    where: { id: req.user!.id },
    data: { password: hashedPassword },
  });
  return res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
}

//등록한 상품 목록 조회
export async function getMyProducts(req: Request, res: Response) {
  const products = await prismaClient.product.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  return res.status(200).json(products);
}

//좋아요 표시한 상품 목록 조회
export async function getMyFavoriteProducts(req: Request, res: Response) {
  const userId = req.user!.id;

  const favorites = await prismaClient.favorite.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  const productList = favorites.map((favorite) => ({
    ...favorite.product,
    isLiked: true,
  }));
  return res.status(200).json(productList);
}
