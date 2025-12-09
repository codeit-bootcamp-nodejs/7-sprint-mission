import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { productRouter } from "./routes/product.route.js";
import { articleRouter } from "./routes/article.route.js";
import { commentRouter } from "./routes/comment.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// BigInt 문제 해결
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Routes
app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);

// Error Handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log("🔥 Server running on http://localhost:3000");
});
