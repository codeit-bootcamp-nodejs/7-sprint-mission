import { BadRequestError } from "../errors/customErrors.js";

export const validateCreateAt = (createdAt) => {
  if (new Date("2024-01-01") > createdAt) {
    throw new BadRequestError(`Invalid createAt ${createdAt.toString()}`);
  }
};
