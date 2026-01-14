import 'dotenv/config';
import express from 'express';
import path from 'path';
import articleRouter from './src/router/article.router.js';
import productRouter from './src/router/product.router.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import commentRouter from './src/router/comment.router.js';
import authRouter from './src/router/auth.router.js';
import userRouter from './src/router/user.router.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/article', articleRouter);
app.use('/product', productRouter);
app.use('/comment', commentRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
