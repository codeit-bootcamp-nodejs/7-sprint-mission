// src/routers/uploadRouter.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { asyncHandler } from "../middlewares/async-handler.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/image", upload.single("image"), asyncHandler(uploadImage));

export default router;
