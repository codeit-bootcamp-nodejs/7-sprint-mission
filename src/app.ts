import 'dotenv/config';
import express from 'express';
import path from 'path';
import articleRouter from './router/article.router';
import productRouter from './router/product.router';
import { errorHandler } from './middlewares/errorHandler';
import commentRouter from './router/comment.router';
import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notificationRouter from './router/notification.router';
import './listeners/notification.listener';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/article', articleRouter);
app.use('/product', productRouter);
app.use('/comment', commentRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/notifications', notificationRouter);

app.use(errorHandler);

export default app;
