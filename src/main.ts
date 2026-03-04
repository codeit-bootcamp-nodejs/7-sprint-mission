import express from 'express';
import cors from 'cors';
import path from 'path';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants';
import articlesRouter from './routers/articlesRouter';
import authRouter from './routers/authRouter';
import productsRouter from './routers/productsRouter';
import commentsRouter from './routers/commentsRouter';
import imagesRouter from './routers/imagesRouter';
import usersRouter from './routers/usersRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';
import cookieParser from 'cookie-parser';
import http from 'http';
import { initSocket } from './lib/socket';
import notificationsRouter from './routers/notificationsRouter';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/notifications', notificationsRouter);


app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
