import express from "express";
import productsRouter from "./routes/products.route.js";
import articlesRouter from "./routes/articles.route.js";
import commentsRouter from "./routes/comments.route.js";
import { errorHandler } from "./error.js";

// BigInt를 JSON으로 변환할 때 문자열로 처리하도록 설정
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
