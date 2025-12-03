import Article from "./article.js";
import { prisma } from "../../prisma/prisma.js";
import { Router } from "express";
import { serializeBigInt } from "./serializeBigInt.js";
import { validateGet, validatePost } from "../middleware/articleValidation.js";
import { BadRequestError } from "../errors/customError.js";

const router = Router();

//강사님 버전
router.get("/", async (req, res, next) => {
  try {
    const findArticlesOption = getFindArticlesOption(req.query);
    const entities = await prisma.article.findMany(findArticlesOption);
    const knonwArticles = entities.map(Article.fromEntity);
    res.json(knonwArticles);
  } catch (e) {
    next(e);
  }
});

//내 버전
// router.get("/", validateGet, async (req, res) => {
//   try {
//     const { validateData, orderBy } = req;

//     const articleDetail = await prisma.article.findMany({
//       where: validateData,
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         created_at: true,
//       },
//       orderBy: {
//         created_at: orderBy,
//       },
//     });

//     res.json(serializeBigInt(articleDetail));
//   } catch (error) {
//     console.log("error: ", error);
//     res.status(404).json({ message: "Server Error!" });
//   }
// });

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

router.post("/", validatePost, async (req, res) => {
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

function getFindArticlesOption({ keyword, page = "1", limit = "10" }) {
  const skip = (parseInt(page) - 1) * limit;
  const take = parseInt(limit);

  const option = {
    skip,
    take,
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  };

  if (keyword) {
    option.where = {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    };
  }
  return option;
}

export default router;
