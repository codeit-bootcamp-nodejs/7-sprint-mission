import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { createRegister } from '../controllers/registerController.js';
import { login } from '../controllers/loginController.js';
import { refreshAccessToken } from '../controllers/authController.js';

const router = express.Router();

//회원가입
router.post('/register', withAsync(createRegister));
//로그인
router.post('/login', withAsync(login));
//리프레시 토큰 갱신
router.post('/refresh', withAsync(refreshAccessToken));

export default router;
