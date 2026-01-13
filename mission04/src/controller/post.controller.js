import e from "express";
import prisma from "../../prisma/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createPost = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const { title, contents } = req.body;

  console.log("userId : ", userId);

  const post = await prisma.post.create({
    data: {
      user_id: userId,
      title,
      contents,
    },
  });

  res.status(201).json({ message: "create post!" });
});

export const deletePost = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const postId = BigInt(req.params.postId);

  const post = await prisma.post.delete({
    where: {
      id: postId,
      user_id: userId,
    },
  });

  if (!post) {
    res.status(404).json({ message: "not exists post" });
  }

  res.status(201).json({ message: "delete ok!" });
});

export const updatePost = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const postId = BigInt(req.params.postId);
  const { title, contents } = req.body;

  const post = await prisma.post.update({
    where: {
      id: postId,
      user_id: userId,
    },
    data: {
      title,
      contents,
    },
  });

  if (!post) {
    res.status(404).json({ message: "not exists post" });
  }

  res.status(201).json({ message: "update ok!" });
});

export const createPostComment = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const postId = BigInt(req.params.postId);
  const { contents } = req.body;

  const postComment = await prisma.comment.create({
    data: {
      contents,
      user_id: userId,
      post_id: postId,
    },
  });

  res.status(201).json({ message: "post comment ok" });
});

export const deletePostComment = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const postId = BigInt(req.params.postId);
  const commentId = BigInt(req.params.commentId);

  try {
    const postComment = await prisma.comment.delete({
      where: {
        user_id: userId,
        post_id: postId,
        id: commentId,
      },
    });
  } catch (e) {
    if (e.code === "P2025") {
      res.status(404).json({ message: "not exists postComment" });
    } else {
      throw e;
    }
  }

  res.status(201).json({ message: "delete comment ok" });
});

export const updatePostComment = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const postId = BigInt(req.params.postId);
  const commentId = BigInt(req.params.commentId);
  const { contents } = req.body;

  try {
    const postComment = await prisma.comment.update({
      where: {
        user_id: userId,
        post_id: postId,
        id: commentId,
      },
      data: {
        contents,
      },
    });
  } catch (e) {
    if (e.code === "P2025") {
      res.status(404).json({ message: "not exists postComment" });
    } else {
      throw e;
    }
  }

  res.status(201).json({ message: "update comment ok" });
});

export const togglePostLike = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const postId = BigInt(req.params.postId);

  const existingLike = await prisma.postLike.findUnique({
    where: {
      user_id_post_id: {
        user_id: userId,
        post_id: postId,
      },
    },
  });

  let likeCount;

  if (existingLike) {
    [, { like_count: likeCount }] = await prisma.$transaction([
      prisma.postLike.delete({
        where: { id: existingLike.id },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { like_count: { decrement: 1 } },
        select: { like_count: true },
      }),
    ]);
  } else {
    [, { like_count: likeCount }] = await prisma.$transaction([
      prisma.postLike.create({
        data: {
          user_id: userId,
          post_id: postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { like_count: { increment: 1 } },
        select: { like_count: true },
      }),
    ]);
  }

  res.json({ isLiked: !existingLike, likeCount: likeCount });
});
