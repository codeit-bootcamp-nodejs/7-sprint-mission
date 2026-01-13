import express from "express";
import { withAsync } from "../lib/withAsync.js";
import { authenticate } from "../ middlewares/authenticate.js";
import {
  getMe,
  updateMe,
  changePassword,
  getMyProducts,
  likedProducts,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", authenticate(), withAsync(getMe));
userRouter.patch("/me", authenticate(), withAsync(updateMe));
userRouter.patch("/me/password", authenticate(), withAsync(changePassword));
userRouter.get("/me/products", authenticate(), withAsync(getMyProducts));
userRouter.get("/me/liked", authenticate(), withAsync(likedProducts));

export default userRouter;
