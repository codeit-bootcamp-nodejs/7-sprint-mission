import { Router } from "express";
import { withAsync } from "../lib/withAsync.js";
import { register, login, logout } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", withAsync(register));
authRouter.post("/login", withAsync(login));
authRouter.post("/logout", withAsync(logout));

export default authRouter;
