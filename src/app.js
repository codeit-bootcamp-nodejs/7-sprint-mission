import express from "express";
import productRouter from "./routes/product.js";
import articleRouter from "./routes/article.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ValidationError } from "./middlewares/validator.js";
import productImageRouter from "./routes/productImage.js";
import { HttpError, NotFoundError } from "./exseptions/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

const bigIntToStringOrBypass = (_, value) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

app.use(express.json());
app.use("json replacer", bigIntToStringOrBypass);

// 라우터 mount
app.use("/products", productRouter);
app.use("/articles", articleRouter);

app.use("/profile", productImageRouter);
app.use("/uploads", productImageRouter);

// 기본 라우트
app.get("/", (req, res) => {
  res.json({
    message: "API Server",
    endpoints: ["/products", "/articles"],
  });
});

// 404 처리 미들웨어: 모든 라우트가 처리되지 않았을 때 실행
app.use((req, res, next) => {
  next(
    new NotFoundError(
      `존재하지 않는 엔드포인트: ${req.method} ${req.originalUrl}`
    )
  );
});

// 포트 기본값 설정 추가
const apiPort = process.env.API_PORT;
app.listen(apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
});

// 최종 에러 처리 미들웨어 (HTTP Error 반영)
app.use((err, req, res, next) => {
  console.error("🚨 에러 발생:", err.stack);

  // 1. ValidationError (유효성 검증 실패, 400)
  if (err instanceof ValidationError) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
    });
  }

  // 2. HttpError 계열
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }
  // 3. 그 외 예상치 못한 서버 에러는 500 Error 처리
  return res.status(500).json({
    error: "InternalServerError",
    message: "서버에서 알 수 없는 에러가 발생했습니다.",
  });
});
