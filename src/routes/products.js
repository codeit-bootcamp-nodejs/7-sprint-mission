import express from "express";
import * as productController from "../modules/products/productController.js";
import productCommentRouter from "./productComment.js";
import { validateProductCreate } from "../middlewares/validateProductCreate.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", validateProductCreate, productController.createProduct);
router.delete("/:id", productController.deleteProduct);
router.patch("/:id", productController.updateProduct);

router.use("/:productId/comments", productCommentRouter);

export default router;
