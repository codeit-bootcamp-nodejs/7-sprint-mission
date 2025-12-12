import { BadRequestError } from "../errors/customErrors.js";

export const validateStringId = (id) => {
  if (typeof id !== "string") {
    throw new BadRequestError(`Invalid id type ${typeof id}`);
  }
};
