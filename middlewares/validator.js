import { ValidationError } from "../middlewares/CustomError.js";

export const validateProductInfo = (req, res, next) => {
  const { name, price, tags } = req.body;
  if (req.method === "POST") {
    if (!name || price === undefined)
      return next(new ValidationError("이름과 가격은 필수입니다."));
  }
  if (price !== undefined && typeof price !== "number")
    return next(new ValidationError("가격은 숫자여야 합니다."));
  if (tags !== undefined && !Array.isArray(tags))
    return next(new ValidationError("태그는 배열이어야 합니다."));
  next();
};

export const validateArticleInfo = (req, res, next) => {
  const { title, content } = req.body;
  if (req.method === "POST") {
    if (!title || !content)
      return next(new ValidationError("제목과 내용은 필수입니다."));
  }
  next();
};

export const validateComment = (req, res, next) => {
  const { content } = req.body;
  if (!content || content.trim() === "")
    return next(new ValidationError("댓글 내용은 필수입니다."));
  next();
};
