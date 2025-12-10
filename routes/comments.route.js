import express from "express";
import { prisma } from "../prisma/prisma.js";
import { asyncHandler } from "../asyncHandler.js";
import { HTTPError } from "../error.js";
import { Comment } from "../structs/comment.js";

const router = express.Router();

router.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    Comment.validateId(id);
    const body = req.body || {};
    Comment.validateUpdate(body);
    const { content } = body;

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

    res.send(Comment.fromEntity(updatedComment));
  })
);

export default router;
