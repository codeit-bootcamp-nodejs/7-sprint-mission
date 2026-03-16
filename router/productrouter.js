import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const wrap = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    console.error(`❌fuck Product Error: [${req.method}] ${req.originalUrl}`);
    console.error(e);
    res.status(500).send({ message: "Server Error" });
  }
};

router.get(
  "/",
  wrap(async (req, res) => {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    // 검색 조건
    const where = {
      OR: [
        { last_name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(pageSize),
    });
    res.send(products);
  })
);

router.post(
  "/",
  upload.single("image"),
  wrap(async (req, res) => {
    const { last_name, description, price, tags } = req.body;

    if (!last_name || !price) {
      return res.status(400).send({ message: "상품명과 가격은 필수입니다." });
    }

    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;
    const priceInt = Number(price);
    const tagArray = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];

    const newProduct = await prisma.product.create({
      data: {
        last_name,
        description,
        price: priceInt,
        tags: tagArray,
        image: imagePath,
      },
    });
    res.status(201).send(newProduct);
  })
);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { viewCount: { increment: 1 } },
    });
    res.send(product);
  })
);

router.patch(
  "/:id",
  wrap(async (req, res) => {
    const { id } = req.params;

    if (req.body.price) req.body.price = Number(req.body.price);

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.send(product);
  })
);

router.delete(
  "/:id",
  wrap(async (req, res) => {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  })
);
router.patch(
  "/:id/like",
  wrap(async (req, res) => {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { likeCount: { increment: 1 } }, // 1 증가
    });
    res.send(product); // 업데이트된 정보(좋아요 수 포함) 돌려줌
  })
);

export default router;
