import { Router } from 'express';
import { uploadImage as multerUpload } from '../middlewares/upload.middleware';
import { uploadImage } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/image', authenticate, (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err) {
      res.status(400).json({ success: false, message: err.message });
      return;
    }
    uploadImage(req, res, next);
  });
});

export default router;
