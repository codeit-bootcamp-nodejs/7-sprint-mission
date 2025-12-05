import express from "express";
import articleRouter from "./routes/article.js";
import productRouter from "./routes/product.js";
import productImageRouter from "./routes/product.image.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { NotFoundError } from "./utils/CustomErrors.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

BigInt.prototype.toJSON = function () {
  // BigInt 값을 문자열로 변환하여 JSON으로 직렬화
  return this.toString();
};

// 라우터 미들웨어 등록
app.use("/api/articles", articleRouter);
app.use("/api/products", productRouter);
app.use("/api/upload/image", productImageRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API Server",
    endpoints: ["/articles", "/products"],
  });
});

//404 Not Found 처리 미들웨어
app.use((req, res, next) => {
  // NotFoundError를 생성하여 next()로 전달합니다.
  next(
    new NotFoundError(
      `요청하신 경로 ${req.method} ${req.originalUrl}를 찾을 수 없습니다.`
    )
  );
});

app.use(errorHandler);

const port = process.env.PORT || process.env.API_PORT || 3000;
app.listen(port, () => {
  console.log(`서버 시작 ${port}`);
});
