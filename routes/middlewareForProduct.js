import { BadRequestError } from "../errors/error.js";

export function validateProductPost(req, res, next) {
  const { name, description, price } = req.body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return next(
      BadRequestError(
        "상품이름은 반드시 작성되어야 하고 문자이며 공백은 불가능합니다."
      )
    );
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    return next(
      BadRequestError("상품설명은 반드시 작성되어야 하고 공백은 불가능합니다.")
    );
  }
  if (!price) {
    return next(BadRequestError("상품의 가격은 반드시 입력하세요."));
  }
  const productPrice = Number(price);
  if (isNaN(productPrice) || productPrice <= 0) {
    return next(
      BadRequestError("상품의 가격은 반드시 숫자이고 0보다 커야합니다.")
    );
  }
  next();
}
