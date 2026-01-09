import express from "express";
import { withAsync } from "../lib/withAsync.js";
import {
  getUser,
  updateUser,
  updatePassword,
  getUserProductList,
  getFavoriteProducts,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";

const userRouter = express.Router();

userRouter.get("/:id", authenticate(), withAsync(getUser));
userRouter.patch("/:id", authenticate(), withAsync(updateUser));
userRouter.patch(
  "/:id/updatePassword",
  authenticate(),
  withAsync(updatePassword)
);
userRouter.get(
  "/:id/getUserProductList",
  authenticate(),
  withAsync(getUserProductList)
);
userRouter.get(
  "/:id/favorited",
  authenticate(),
  withAsync(getFavoriteProducts)
);
export default userRouter;
