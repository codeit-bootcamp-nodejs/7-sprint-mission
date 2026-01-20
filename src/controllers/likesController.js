import { prismaClient } from '../lib/prismaClient.js';

export const toggleProductLike = async (req, res) => {
  const { productId } = req.params;
  const where = { userId_productId: { userId: req.user.id, productId: Number(productId) } };
  const existing = await prismaClient.like.findUnique({ where });

  if (existing) {
    await prismaClient.like.delete({ where });
    res.json({ isLiked: false });
  } else {
    await prismaClient.like.create({
      data: { user: { connect: { id: req.user.id } }, product: { connect: { id: Number(productId) } } },
    });
    res.json({ isLiked: true });
  }
};

export const getMyLikedProducts = async (req, res) => {
  const likedData = await prismaClient.like.findMany({
    where: { userId: req.user.id, productId: { not: null } },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(likedData.map((item) => item.product));
};