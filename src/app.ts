import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import articleRoutes from './routes/article.routes';
import commentRoutes from './routes/comment.routes';
import uploadRoutes from './routes/upload.routes';

import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
