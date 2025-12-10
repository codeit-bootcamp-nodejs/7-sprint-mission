import { Router } from "express";
import { ProductComment } from "./comment.js";
import { prisma } from "../../prisma/prisma.js";
import { validateId } from "../middleware/productValidation.js";

const router = Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
  try {
    const { content } = req.body;
    console.log("content: ", content);

    await prisma.product_comment.create({
      data: {
        content,
        product_id: req.params.productId,
      },
    });

    res.json({ message: "create product comment ok" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const params = req.params;
    const deleteId = Number(params.id);

    const deleteData = await prisma.product_comment.delete({
      where: {
        id: deleteId,
      },
    });

    res.json({ message: "삭제 완료" });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const params = req.params;
    const deleteId = Number(params.id);

    const { content } = req.body;

    const updateData = await prisma.product_comment.update({
      where: {
        id: deleteId,
      },
      data: {
        content,
      },
    });

    console.log("수정 DATA");
    console.log(ProductComment.fromEntity(updateData));

    res.json({ message: "수정 완료" });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const entities = await prisma.product_comment.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    const productsData = entities.map(ProductComment.fromEntity);
    res.json(productsData);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", validateId, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const entity = await prisma.product_comment.findUnique({
      where: {
        id,
      },
    });
    const productData = ProductComment.fromEntity(entity);
    res.json(productData);
  } catch (e) {
    next(e);
  }
});

export default router;
