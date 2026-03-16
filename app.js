import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import productRouter from "./router/productrouter.js";
import articleRouter from "./router/articlerouter.js";
import commentRouter from "./router/commentrouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.url}`);
  next();
});
app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use((req, res, next) => {
  res.status(404).send({ error: "페이지를 찾을 수 없습니다 (404)" });
});

app.listen(PORT, () => {
  console.log(`🚀 서버 정상 가동 중: http://localhost:${PORT}`);
});

export default app;
