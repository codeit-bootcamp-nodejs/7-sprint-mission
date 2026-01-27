import express from 'express';
import { withAsync } from '../lib/withAsync';
import { uploadImage } from '../controllers/imageController';
import { upload } from '../lib/multer';

const imageRouter = express.Router();

imageRouter.post('/upload', upload.single('image'), withAsync(uploadImage));

export default imageRouter;
