import "express-serve-static-core";
import type { JwtUser } from "./jwt.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtUser;
  }
}

export {};
