import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import articleRoutes from './routes/articles.js';
import commentRoutes from './routes/comments.js';
import uploadRoutes from './routes/upload.js'; // [추가]
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// [추가] 업로드된 이미지를 접근 가능하게 설정 (http://localhost:3000/uploads/파일명)
app.use('/uploads', express.static('uploads'));

// 라우터 등록
app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes); // [추가] POST /api/upload/image

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
