import { prisma } from "../../prisma/prisma.js";
import { Router } from "express";
import { serializeBigInt } from "./serializeBigInt.js";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const { title, content, createdAt, orderBy } = req.query;
    const getDetail = {};

    if (title && content) {
      getDetail.title = { contains: title, mode: "insensitive" };
      getDetail.content = { contains: content, mode: "insensitive" };
    } else if (title) {
      getDetail.title = { contains: title, mode: "insensitive" };
    } else if (content) {
      getDetail.content = { contains: content, mode: "insensitive" };
    } else if (createdAt) {
      getDetail.createdAt = createdAt;
    } else {
      res.json({ message: "찾으시는 결과가 없습니다." });
    }
    console.log(getDetail);

    const productDetail = await prisma.article.findMany({
      where: getDetail,
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
      },
      orderBy: {
        created_at: orderBy,
      },
    });

    res.json(serializeBigInt(productDetail));
  } catch (error) {
    console.log("error: ", error);
    res.status(404).json({ message: "Server Error!" });
  }
});

router.get("/", async (req, res) => {
  try {
    const getAll = await prisma.article.findMany();

    res.json(serializeBigInt(getAll));
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ massage: "Server Error!" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const getId = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json(serializeBigInt(getId));
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const insertArticle = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.json(serializeBigInt(insertArticle));
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.delete("/:id", async (req, res) => {
  const delId = Number(req.params.id);
  try {
    await prisma.article.delete({
      where: { id: delId },
    });
    res.json({ message: "Delete OK!" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    await prisma.article.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.json({ message: "수정 완료" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

export default router;
