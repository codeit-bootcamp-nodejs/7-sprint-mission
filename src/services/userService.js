import { prisma } from "../../prisma/prisma.js";
import { HttpError, NotFoundError } from "../../errors/customErrors.js";
import { verifyPassword, hashPassword } from "../../utils/password.js";

// 유저 정보 조회
export const getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new NotFoundError("유저를 찾을 수 없습니다.");
  return user;
};

// 유저 정보 수정 (nickname/image)
export const updateUser = async (userId, { nickname, image }) => {
  if (nickname !== undefined) {
    if (typeof nickname !== "string" || nickname.trim() === "") {
      throw new HttpError("닉네임을 입력해 주세요.", 400);
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(nickname !== undefined ? { nickname: nickname.trim() } : {}),
      ...(image !== undefined ? { image } : {}),
    },
  });
};

// 비밀번호 변경
export const changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new HttpError("현재 비밀번호와 새 비밀번호를 입력해 주세요.", 400);
  }
  if (typeof newPassword !== "string" || newPassword.length < 4) {
    throw new HttpError("새 비밀번호는 4자 이상이어야 합니다.", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("유저를 찾을 수 없습니다.");

  const ok = await verifyPassword(currentPassword, user.password);
  if (!ok) throw new HttpError("현재 비밀번호가 올바르지 않습니다.", 400);

  const nextHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: nextHash },
  });

  return true;
};

// 등록한 상품 목록 (cursor pagination)
export const listUserProducts = async (userId, { limit, cursorId }) => {
  const take = limit ? parseInt(limit, 10) : 10;

  const query = {
    where: { user_id: userId },
    orderBy: { id: "desc" },
    take,
  };

  if (cursorId) {
    query.cursor = { id: BigInt(cursorId) };
    query.skip = 1;
  }

  const entities = await prisma.product.findMany(query);

  const last = entities[entities.length - 1];
  const nextCursorId = last ? last.id.toString() : null;

  return { entities, nextCursorId };
};

// 좋아요 상품 목록
export const listLikedProducts = async (userId, { limit, cursorId }) => {
  const take = limit ? parseInt(limit, 10) : 10;

  const query = {
    where: { user_id: userId },
    orderBy: { id: "desc" },
    take,
    include: {
      product: {
        include: {
          likes: { where: { user_id: userId }, select: { id: true } },
        },
      },
    },
  };

  if (cursorId) {
    query.cursor = { id: BigInt(cursorId) };
    query.skip = 1;
  }

  const likeRows = await prisma.productLike.findMany(query);
  const entities = likeRows.map((r) => r.product);

  const last = likeRows[likeRows.length - 1];
  const nextCursorId = last ? last.id.toString() : null;

  return { entities, nextCursorId };
};

// 좋아요 게시글 목록
export const listLikedArticles = async (userId, { limit, cursorId }) => {
  const take = limit ? parseInt(limit, 10) : 10;

  const query = {
    where: { user_id: userId },
    orderBy: { id: "desc" },
    take,
    include: {
      article: {
        include: {
          likes: { where: { user_id: userId }, select: { id: true } },
        },
      },
    },
  };

  if (cursorId) {
    query.cursor = { id: BigInt(cursorId) };
    query.skip = 1;
  }

  const likeRows = await prisma.articleLike.findMany(query);
  const entities = likeRows.map((r) => r.article);

  const last = likeRows[likeRows.length - 1];
  const nextCursorId = last ? last.id.toString() : null;

  return { entities, nextCursorId };
};
