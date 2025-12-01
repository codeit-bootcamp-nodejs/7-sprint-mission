import express from "express";
import articleRouter from "./routes/article.route.js";

import { config } from "dotenv";
config(); // .env 읽어서 process.env.아래 위치시키기

const app = express();
app.use(express.json());

app.use("/articles", articleRouter);

app.get("/", (req, res) => {
  res.json({
    message: "RESTful API server",
    endpoints: ["/products", "/articles"],
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  console.log(err.stack());
  console.log("실패한 요청:", req);
  console.log("실패한 응답:", res);
  // 부가적인 처리...
});

const apiPort = process.env.API_PORT; // 읽어온 port 설정
app.listen(apiPort, () => {
  console.log(`떴다 ${apiPort}`);
});
