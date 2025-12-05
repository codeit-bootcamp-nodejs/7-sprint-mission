import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.route.js";
import articlesRouter from "./routes/articles.route.js";
import commentsRouter from "./routes/comments.route.js";
import uploadRouter from "./routes/upload.route.js";
import { errorHandler } from "./error.js";

// BigInt를 JSON으로 변환할 때 문자열로 처리하도록 설정
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

app.use(cors());
app.use(express.json());

// 정적 파일 제공 (uploads 폴더)
app.use("/uploads", express.static("uploads"));

app.use("/api/products", productsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/upload", uploadRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
