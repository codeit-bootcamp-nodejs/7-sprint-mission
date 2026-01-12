import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import {
  ChangePasswordBodyStruct,
  UpdateUserBodyStruct,
} from "../structs/userStructs.js";
import bcrypt from "bcrypt";

export async function getMe(req, res) {
  const userId = req.user.id;
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
    },
  });
  if (!user) {
    throw new NotFoundError("User", userId);
  }
  res.send(user);
}

export async function updateMe(req, res) {
  const data = create(req.body, UpdateUserBodyStruct);
  const updatedUser = await prismaClient.user.update({
    where: { id: req.user.id },
    data,
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
    },
  });
  res.send(updatedUser);
}

export async function updatePassword(req, res) {
  const { password, newPassword } = create(req.body, ChangePasswordBodyStruct);
  const userId = req.user.id;

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError("User", userId);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ message: "현재 비밀번호가 일치하지 않습니다." });
  }

  await prismaClient.user.update({
    where: { id: userId },
    data: {
      password: newPassword,
    },
  });
  return res.status(204).send();
}

export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const myProducts = await prismaClient.product.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "내가 등록한 상품을 가져왔습니다.",
      data: myProducts,
    });
  } catch (error) {
    console.error("상품조회 오류발생", error);
    res.status(500).json({
      success: false,
      message: "상품목록 조회 실패",
    });
  }
};
