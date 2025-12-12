import express from "express";
import productRouter from "./products.js";
import articleRouter from "./articles.js";
import imageRouter from "./images.js";

const router = express.Router();

router.use("/products", productRouter);
router.use("/articles", articleRouter);
router.use("/images", imageRouter);

export default router;
