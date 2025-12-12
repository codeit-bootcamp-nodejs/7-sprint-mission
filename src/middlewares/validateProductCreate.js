import { BadRequestError } from "../errors/coustomErrors.js";

export const validateProductCreate = (req, res, next) => {
  const { name, price } = req.body;

  if (typeof name !== "string") {
    return next(new BadRequestError(`Invalid name type ${typeof name}`));
  }

  if (typeof price !== "number") {
    return next(new BadRequestError(`Invalid price type ${typeof price}`));
  }

  if (name.length === 0) {
    return next(new BadRequestError("이름을 적어주세요."));
  }

  if (price <= 0) {
    return next(new BadRequestError("가격은 0이상의 숫자여야 합니다."));
  }

  next();
};
