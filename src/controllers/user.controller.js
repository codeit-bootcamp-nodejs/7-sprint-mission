import { prisma } from "../lib/prismaClient.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js";
import {
  UpdateMe,
  ChangePassword,
  GetproductParams,
} from "../validation/user.js";
export async function getMe(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("유저를 찾을 수 없습니다.");
  }

  return res.json(user);
}

export async function updateMe(req, res) {
  const data = UpdateMe.parse(req.body);

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data,
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.json(updated);
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = ChangePassword.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, password: true },
  });

  if (!user) {
    throw new NotFoundError("유저를 찾을 수 없습니다.");
  }

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    throw new BadRequestError("현재 비밀번호가 일치하지 않습니다.");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed },
  });

  return res.json({ message: "비밀번호가 변경되었습니다." });
}

export async function getMyProducts(req, res) {
  const { page, pageSize } = GetproductParams.parse(req.query);

  const skip = (page - 1) * pageSize;

  const data = await prisma.product.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
    select: { id: true, name: true, price: true, createdAt: true },
  });

  return res.json({ data });
}

export async function likedProducts(req, res) {
  const likes = await prisma.productLike.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });

  return res.send(
    likes.map((like) => ({
      ...like.product,
      isLiked: true,
    }))
  );
}
