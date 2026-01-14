import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import { HttpError } from "../../errors/customErrors.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

const validateRegister = (req, res, next) => {
  const { email, nickname, password } = req.body;

  if (!email) throw new HttpError("이메일을 입력해 주세요.", 400);
  if (!nickname) throw new HttpError("닉네임을 입력해 주세요.", 400);
  if (!password) throw new HttpError("비밀번호를 입력해 주세요.", 400);

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) throw new HttpError("이메일을 입력해 주세요.", 400);
  if (!password) throw new HttpError("비밀번호를 입력해 주세요.", 400);

  next();
};

const validateRefresh = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new HttpError("인증이 만료되었습니다. 다시 로그인해 주세요.", 400);
  next();
};

router.post("/register", validateRegister, asyncHandler(authController.register));
router.post("/login", validateLogin, asyncHandler(authController.login));
router.post("/refresh", validateRefresh, asyncHandler(authController.refresh));

export default router;
