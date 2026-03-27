import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { validateRegister, validateLogin } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);
router.post('/refresh', authController.refresh);

export default router;
