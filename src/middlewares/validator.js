import CustomError from "../utils/CustomError.js";

export const validateProductInfo = (req, res, next) => {
  if (req.method === "POST") {
    const { name, description, price, tags } = req.body;
    if (!name || !description || req.body.price === undefined || !tags) {
      return next(
        new CustomError(
          "필수 데이터(상품명, 정보, 가격, 태그)를 입력해 주세요.",
          400
        )
      );
    }
    if (isNaN(price)) {
      return next(new CustomError("가격을 숫자로 입력해 주세요.", 400));
    }
  }
  if (req.method === "PATCH" && Object.keys(req.body).length === 0) {
    {
      return next(new CustomError("수정할 데이터를 입력해 주세요.", 400));
    }
  }
  next();
};

export const validateArticleInfo = (req, res, next) => {
  if (req.method === "PATCH" && Object.keys(req.body).length === 0) {
    return next(new CustomError("수정할 데이터를 입력해 주세요.", 400));
  }
  if (req.method === "POST") {
    const { title, content } = req.body;
    if (!title || !content) {
      return next(
        new CustomError("필수 데이터(제목, 내용)를 입력해 주세요.", 400)
      );
    }
  }
  next();
};

export const validateCommentInfo = (req, res, next) => {
  if (req.method === "PATCH" && Object.keys(req.body).length === 0) {
    return next(new CustomError("수정할 데이터를 입력해 주세요.", 400));
  }
  if (req.method === "POST" || req.method === "PATCH") {
    const { content } = req.body;
    if (req.method === "POST" && !content) {
      return next(new CustomError("댓글을 입력해 주세요.", 400));
    }
  }
  next();
};
