import express from "express";
import { prisma } from "../prisma/prisma.js";
import { asyncHandler } from "../asyncHandler.js";
import { HTTPError } from "../error.js";
import { Comment } from "../structs/comment.js";

const router = express.Router();

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = req.body || {};
    const { content } = body;

    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }

    // 1차: 입력값 검증 (미들웨어/핸들러)
    if (!content || typeof content !== "string") {
      throw new HTTPError(400, "Content is required and must be a string");
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new HTTPError(404, "Cannot find comment");
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    // 2차: fromEntity 검증
    res.send(Comment.fromEntity(updatedComment));
  })
);

export default router;
