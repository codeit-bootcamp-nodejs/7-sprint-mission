import express from "express";
import productService from "../services/product.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import { validateProductInfo } from "../middlewares/validator.js";

const router = express.Router();

router
  .route("/")
  .post(
    validateProductInfo,
    asyncHandler(async (req, res) => {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json({ message: "Success", data: newProduct });
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, sort = "recent", search } = req.query;
      const { products, totalCount } = await productService.getProductList({
        offset: Number(offset),
        limit: Number(limit),
        sort,
        search,
      });
      res.status(200).json({
        message: "Success",
        totalCount: totalCount,
        data: products,
      });
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        throw new CustomError("상품을 찾을 수 없습니다.", 404);
      }
      res.status(200).json({
        message: "Success",
        data: product,
      });
    })
  )
  .patch(
    validateProductInfo,
    asyncHandler(async (req, res) => {
      const updatedProduct = await productService.patchProduct(
        req.params.id,
        req.body
      );
      res.status(200).json({ message: "Success", data: updatedProduct });
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    })
  );

export default router;
