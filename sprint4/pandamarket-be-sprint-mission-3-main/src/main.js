import 'dotenv/config';
// import dotenv from 'dotenv';
// dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants.js';
import articlesRouter from './routers/articlesRouter.js';
import productsRouter from './routers/productsRouter.js';
import commentsRouter from './routers/commentsRouter.js';
import imagesRouter from './routers/imagesRouter.js';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController.js';
import authRouter from './routers/authRouter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/auth', authRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
