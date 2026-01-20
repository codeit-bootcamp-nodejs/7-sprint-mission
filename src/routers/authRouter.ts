import express from "express";
import {
  signUp,
  login,
  refreshAccessToken,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshAccessToken);
export default authRouter;
