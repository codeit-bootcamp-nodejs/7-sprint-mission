import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { upload, uploadImage } from '../controllers/imagesController';

const router = Router();

router.post('/upload', authenticate, upload.single('image'), uploadImage);

export default router;
