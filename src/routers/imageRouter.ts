import express from 'express';
import { withAsync } from '../lib/withAsync';
import { deleteImage, uploadImage } from '../controllers/imageController';
import { upload } from '../lib/multer';

const imageRouter = express.Router();

imageRouter.post('/upload', upload.single('image'), withAsync(uploadImage));

imageRouter.delete('/:filename', withAsync(deleteImage));

export default imageRouter;
