import express from "express";
import { upload } from "../middlewares/multer.js";
import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import { MulterError } from "multer";

const router = express.Router();

router.post(
  "/image",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        if (err instanceof MulterError) {
          return next(err);
        }
        if (
          err.message === "이미지 파일만 업로드할 수 있습니다." ||
          err.cause === 400
        ) {
          return next(new CustomError(err.message, 400));
        }
        return next(err);
      }
      next();
    });
  },
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new CustomError("파일이 업로드되지 않았습니다.", 400);
    }
    const imagePath = `/uploads/${req.file.filename}`;
    res.status(201).json({ message: "Success", data: imagePath });
  })
);

export default router;
