import express from "express";
import { withAsync } from "../lib/withAsync.js";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  favoriteProduct,
  disfavoriteProduct,
} from "../controllers/productsController.js";
import { authenticate } from "../middlewares/authenticate.js";

const productsRouter = express.Router();

productsRouter.post("/", authenticate(), withAsync(createProduct));
productsRouter.get("/:id", withAsync(getProduct));
productsRouter.patch("/:id", authenticate(), withAsync(updateProduct));
productsRouter.delete("/:id", authenticate(), withAsync(deleteProduct));
productsRouter.get("/", withAsync(getProductList));
productsRouter.post("/:id/comments", authenticate(), withAsync(createComment));
productsRouter.get("/:id/comments", authenticate(), withAsync(getCommentList));
productsRouter.post(
  "/:id/favorite",
  authenticate(),
  withAsync(favoriteProduct)
);
productsRouter.delete(
  "/:id/favorite",
  authenticate(),
  withAsync(disfavoriteProduct)
);

export default productsRouter;
