import prisma from "../../prisma/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashedPassword = (password) => {
  const saltRounds = 10;

  return bcrypt.hashSync(password, saltRounds);
};

export const createUser = asyncHandler(async (req, res) => {
  const { email, password, nickname } = req.body;

  const getUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
    select: { email: true, nickname: true },
  });
  console.log(getUser);

  if (getUser) {
    if (getUser.email) {
      return res.status(404).json({ message: "invalid email" });
    }
    if (getUser.nickname) {
      return res.status(404).json({ message: "invalid nickname" });
    }
  }

  const setUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword(password),
      nickname,
    },
  });

  res.status(201).json({ ...setUser, id: Number(setUser.id) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const getUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!getUser) {
    return res.status(404).json({ message: "not exists email" });
  }

  const isMatch = await bcrypt.compare(password, getUser.password);

  if (!isMatch) {
    return res.status(404).json({ message: "invalid password" });
  }

  const payload = {
    id: Number(getUser.id),
    role: "user",
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });

  await prisma.user.update({
    where: {
      id: getUser.id,
    },
    data: {
      refresh_token: refreshToken,
    },
  });

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1hour
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/api/user/auth/refresh",
  });

  res.status(201).json({ message: "login success" });
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const payload = {
    id: Number(userId),
    role: "user",
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refresh_token: refreshToken,
    },
  });

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1hour
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/api/user/auth/refresh",
  });

  res.json({ message: "Token refresh ok" });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.json({ message: "logout ok" });
});

export const checkUserInfo = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);

  const getUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      nickname: true,
      email: true,
      image: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!getUser) {
    res.status(404).json({ message: "not exists user" });
  }

  res.status(201).json(getUser);
});

export const updateUserInfo = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const { nickname, email, image } = req.body;

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      nickname,
      email,
      image,
    },
    select: {
      nickname: true,
      email: true,
      image: true,
      created_at: true,
      updated_at: true,
    },
  });

  res.status(201).json(updateUser);
});

export const updateUserPassword = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ error: "현재 비밀번호가 일치하지 않습니다." });
  }
  if (currentPassword === newPassword) {
    return res
      .status(400)
      .json({ error: "새 비밀번호는 이전과 다르게 설정해야 합니다." });
  }

  const hashedNewPassword = hashedPassword(newPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  res.status(201).json({ message: "비밀번호가 변경되었습니다." });
});

export const checkUserProduct = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);

  const product = await prisma.product.findMany({
    where: {
      user_id: userId,
    },
  });

  if (!product) {
    return res
      .status(404)
      .json({ error: "유저의 정보로 작성 된 상품이 없습니다." });
  }

  const productList = product.map((data) => {
    return {
      id: data.id.toString(),
      name: data.name,
      price: data.price,
      like_count: data.like_count,
      user_id: data.user_id.toString(),
    };
  });

  res.status(201).json(productList);
});

export const checkUserLikeProduct = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);

  const likeProductList = await prisma.productLike.findMany({
    where: {
      user_id: userId,
    },
  });
});
