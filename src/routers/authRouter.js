import express from "express";
import { withAsync } from "../lib/withAsync.js";
import {
  register,
  login,
  logout,
  refreshTokens,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", withAsync(register));
authRouter.post("/login", withAsync(login));
authRouter.post("/logout", withAsync(logout));
authRouter.post("/refresh", authenticate(), withAsync(refreshTokens));
export default authRouter;
