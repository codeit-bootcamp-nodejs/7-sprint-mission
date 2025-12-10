import { ArticleComment } from "./comment.js";
import { Router } from "express";
import { prisma } from "../../prisma/prisma.js";
import {
  orderByToSort,
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
} from "../utils/cursor-pagination.js";

const router = Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
  const { content } = req.body;
  console.log("req.params: ", req.params);

  const created = await prisma.article_comment.create({
    data: {
      content,
      article_id: req.params.articleId,
    },
  });
  res.json(content);
});

router.patch("/:id", async (req, res, next) => {
  const { content } = req.body;

  const udpate = await prisma.article_comment.update({
    where: { id: req.params.id },
    data: {
      content,
      article_id: req.params.articleId,
    },
  });
  res.json(content);
});

router.delete("/:id", async (req, res, next) => {
  try {
    const drop = await prisma.article_comment.delete({
      where: { id: req.params.id },
    });
    res.json({ message: `${req.params.id}번 댓글 삭제 완료` });
  } catch (e) {
    next(e);
  }
});

// router.get("/", async (req, res, next) => {
//   try {
//     const { id, content, created_at } = req.query;
//     const entities = await prisma.article_comment.findMany({
//       orderBy: {
//         id: "desc",
//       },
//     });
//     console.log(entities);
//     const ArticleData = entities.map(ArticleComment.fromEntity);

//     res.json(ArticleData);
//   } catch (e) {
//     next(e);
//   }
// });

// router.get("/:id", async (req, res, next) => {
//   try {
//     const entity = await prisma.article_comment.findUnique({
//       where: { id: parseInt(req.params.id) },
//     });
//     console.log(entity);

//     res.json(ArticleComment.fromEntity(entity));
//   } catch (e) {
//     next(e);
//   }
// });

//cursor
router.get("/", async (req, res, next) => {
  try {
    const { cursor, limit = "10" } = req.query;
    const take = parseInt(limit);

    if (isNaN(take) || take <= 0) {
      throw new BadRequestError("유효하지 않은 limit 값입니다.");
    }

    // 정렬 기준: created_at DESC, id ASC
    const orderBy = [{ created_at: "desc" }, { id: "asc" }];
    const sort = orderByToSort(orderBy);

    // cursor token 파싱
    const cursorToken = parseContinuationToken(cursor);
    const cursorWhere = cursorToken
      ? buildCursorWhere(cursorToken.data, cursorToken.sort)
      : {};

    // 기본 where 조건 (article_id 필터)
    const baseWhere = {
      article_id: req.params.articleId,
    };

    // cursor 조건과 기본 조건 병합
    const where =
      Object.keys(cursorWhere).length > 0
        ? { AND: [baseWhere, cursorWhere] }
        : baseWhere;

    // limit + 1개를 조회하여 다음 페이지 존재 여부 확인
    const entities = await prisma.article_comment.findMany({
      where,
      orderBy,
      take: take + 1,
    });

    // 다음 페이지가 있는지 확인
    const hasNext = entities.length > take;
    const items = hasNext ? entities.slice(0, take) : entities;

    // 다음 페이지를 위한 continuation token 생성
    const nextCursor = hasNext
      ? createContinuationToken(
          {
            id: items[items.length - 1].id,
            created_at: items[items.length - 1].created_at,
          },
          sort
        )
      : null;

    const articleComments = items.map(ArticleComment.fromEntity);

    res.json({
      data: articleComments,
      nextCursor,
      hasNext,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
