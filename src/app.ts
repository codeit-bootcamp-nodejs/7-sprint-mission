import 'dotenv/config';
import express from 'express';
import path from 'path';
import articleRouter from './router/article.router';
import productRouter from './router/product.router';
import { errorHandler } from './middlewares/errorHandler';
import commentRouter from './router/comment.router';
import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import { createServer } from 'http';
import { Server } from 'socket.io';
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

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://web.postman.co'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('유저 연결됨:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`유저 ${userId}가 방에 입장했습니다.`);
  });

  socket.on('disconnect', () => {
    console.log('유저 연결 끊김:', socket.id);
  });
});

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
