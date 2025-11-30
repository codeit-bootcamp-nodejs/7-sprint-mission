import express from "express";
import articleRouter from "./routes/articleRouter.js";
import productRouter from "./routes/productRouter.js";

const app = express();
app.use(express.json());

app.use("/article", articleRouter);
app.use("/product", productRouter);

export default app;
