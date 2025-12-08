import { Router } from "express";
import multer from "multer";
import { prisma } from "../prisma/prisma.js";
import { validateProduct } from "../middlewares/validateProduct.js";

export const productRouter = Router();
const upload = multer({ dest: "uploads/" });

// 상품 등록
productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  async (req, res, next) => {
    try {
      const { name, description, price, tags } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: Number(price),
          tags: tags?.split(",") || [],
          image: req.file ? req.file.path : null,
        },
      });

      res.status(201).json(product);
    } catch (e) {
      next(e);
    }
  }
);

// 목록 조회
productRouter.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword;

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
      : {};

    const items = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    res.json(items);
  } catch (e) {
    next(e);
  }
});

// 상세 조회
productRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) return res.status(404).json({ error: "상품 없음" });

    res.json(product);
  } catch (e) {
    next(e);
  }
});

// 수정
productRouter.patch("/:id", validateProduct, async (req, res, next) => {
  try {
    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// 삭제
productRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
