import express from "express";
import {
  createUser,
  login,
  logout,
  checkUserInfo,
  updateUserInfo,
  updateUserPassword,
  checkUserProduct,
  refreshTokens,
} from "../controller/user.controller.js";
import {
  accessTokenVerify,
  refreshTokenVerify,
} from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.post("/logout", logout);

router.get("/getUserInfo", accessTokenVerify, checkUserInfo);
router.get("/getUserProduct", accessTokenVerify, checkUserProduct);

router.patch("/updateUserInfo", accessTokenVerify, updateUserInfo);
router.patch("/updateUserPassword", accessTokenVerify, updateUserPassword);

router.post("/auth/refresh", refreshTokenVerify, refreshTokens);

export default router;
