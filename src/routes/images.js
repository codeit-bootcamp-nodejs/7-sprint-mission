import express from "express";
import * as imageController from "../modules/images/imageController.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.post("/", upload.single("image"), imageController.uploadSingleImage);

export default router;
