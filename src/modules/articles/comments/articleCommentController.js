import * as articleCommentService from "./articleCommentService.js";

export const createComment = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const comment = await articleCommentService.createdComment(
      req.body.content,
      articleId
    );

    return res.status(201).json({
      success: true,
      message: "댓글 생성 완료",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const commentsInfo = await articleCommentService.getComments({
      articleId,
      ...req.query,
    });

    return res.status(200).json({
      success: true,
      data: commentsInfo.comments,
      nextCursor: commentsInfo.nextCursor,
      hasNext: commentsInfo.hasNext,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const updateComment = await articleCommentService.updateComment(
      req.params.id,
      req.body.content
    );

    return res.status(200).json({
      success: true,
      message: "댓글 변경 완료.",
      data: updateComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const deleteComment = await articleCommentService.deleteComment(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "댓글 삭제 완료",
      data: deleteComment,
    });
  } catch (error) {
    next(error);
  }
};
