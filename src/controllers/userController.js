import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import BadRequestError from "../lib/errors/BadRequestError.js";

import { IdParamsStruct } from "../structs/commonStructs.js";

import {
  UpdateRegisterBodyStruct,
  GetRegisterListParamsStruct,
  UpdatePasswordBodyStruct,
} from "../structs/userStructs.js";
import bcrypt from "bcrypt";

export async function getUser(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const user = await prismaClient.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError("user", id);
  }
  const { password: _, ...userWithoutPassword } = user;
  return res.send(userWithoutPassword);
}

export async function updateUser(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const { nickname } = create(req.body, UpdateRegisterBodyStruct);
  const existingUser = await prismaClient.user.findUnique({
    where: { id },
  });
  if (!existingUser) {
    throw new NotFoundError("user", id);
  }
  if (existingUser.id !== id) {
    throw new BadRequestError("등록한 유저정보가 맞지 않습니다.");
  }

  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: { nickname },
  });
  const { password: _, ...userWithoutPassword } = updatedUser;
  return res.send(userWithoutPassword);
}

export async function updatePassword(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const { password } = create(req.body, UpdatePasswordBodyStruct);
  const existingUser = await prismaClient.user.findUnique({
    where: { id },
  });
  if (!existingUser) {
    throw new NotFoundError("user", id);
  }
  if (existingUser.id !== id) {
    throw new BadRequestError("등록한 유저정보가 맞지 않습니다.");
  }

  const isPasswordVaild = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordVaild) {
    throw new BadRequestError("Wrong password");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedPassword = await prismaClient.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
  const { password: _, ...userWithoutPassword } = updatedPassword;
  return res.send(userWithoutPassword);
}
export async function getUserProductList(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetRegisterListParamsStruct
  );

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;
  const totalCount = await prismaClient.product.count({
    where: { userId: id },
  });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
    where: { userId: id },
  });

  return res.send({
    list: products,
    totalCount,
  });
}

export async function getFavoriteProducts(req, res) {
  const userId = req.user.id;

  const likes = await prismaClient.favorite.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const products = likes.map((favorite) => favorite.product);

  return res.status(200).json(products);
}
