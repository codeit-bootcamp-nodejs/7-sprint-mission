import { Router } from "express";
import * as authController from "../controllers/authController.js";
import {asyncHandler} from "../middlewares/async-handler.js";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));

export default router;
