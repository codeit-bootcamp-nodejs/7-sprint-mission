import { BadRequestError } from "../errors/coustomErrors.js";

export const validateArticleCreate = (req, res, next) => {
  const { title, content } = req.body;

  if (typeof title !== "string") {
    return next(new BadRequestError(`Invalid title type ${typeof title}`));
  }

  if (typeof content !== "string") {
    return next(new BadRequestError(`Invalid content type ${typeof content}`));
  }

  if (title.length === 0) {
    return next(new BadRequestError("제목을 적어주세요."));
  }

  if (content.length === 0) {
    return next(new BadRequestError("내용을 적어주세요."));
  }

  next();
};
