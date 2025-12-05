import express from "express";
import cors from "cors";
import articleRouter from "./routes/article.router.js";
import productRouter from "./routes/product.router.js";
import articleCommentRouter from "./routes/article-comment.router.js";
import productCommentRouter from "./routes/product-comment.router.js";
import productImageRouter from "./routes/product-image.router.js";
import multerUploadRouter from "./routes/multer.router.js";
import { HttpError } from "./errors/customError.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/articles", articleRouter);
app.use("/api/products", productRouter);
app.use("/api/articles/:articleId/comments", articleCommentRouter);
app.use("/api/products/:productId/comments", productCommentRouter);
app.use("/api/upload", multerUploadRouter);
app.use("/api/products/:productId/upload", productImageRouter);

app.get("/", (req, res) => {
  res.json({
    massage: "RESTful API server",
    endpoints: ["/api/products", "/api/articles", "/api/article-comment"],
  });
});

//parameter 4개면 error를 받음
//제일 밑에 작성해야 함 (listen 바로 위에)
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
});

export default app;
