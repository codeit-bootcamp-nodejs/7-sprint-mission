// app.js (After - 모듈화)
import express from "express";
import articleRouter from "./routes/article.js";
import productRouter from "./routes/product.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const bigIntToStringOrBypass = (_, value) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

app.use(express.json());
// app.set("json replacer", bigIntToStringOrBypass);

// 라우터 mount
app.use("/articles", articleRouter);
app.use("/products", productRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API Server",
    endpoints: ["/articles", "/products"],
  });
});

const apiPort = process.env.API_PORT;
app.listen(apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
});
