import { BadRequestError } from "../errors/error.js";

export function validateArticlePost(req, res, next) {
  const { title, content } = req.body;
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return next(
      BadRequestError(
        "게시글 제목은 반드시 작성되어야 하고 문자이며 공백은 불가능합니다."
      )
    );
  }
  if (!content) {
    return next(BadRequestError("상품설명은 반드시 작성되어야 합니다."));
  }
}
