import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import articlesRouter from "./routes/articles.js";
import { HttpError } from "./errors/error.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/products", productsRouter);
app.use("/articles", articlesRouter);

app.get("/", (req, res) => {
  res.json({
    message: "RESTful API server",
    endpoints: ["/products", "/articles"],
  });
});

app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      errorName: err.name,
      message: err.message,
    });
  }

  console.error(err.stack);
  return res.status(500).json({
    errorName: "InternalServerError",
    message: "예상치 못한 서버 오류가 발생했습니다.",
  });
});

app.listen(PORT, () => {
  console.log("서버 잘 작동중!");
});
