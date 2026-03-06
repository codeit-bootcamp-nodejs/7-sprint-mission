// ★ app.js (After - 모듈화)
import express from "express";
// 라우터 import
import cors from "cors";
import productRouter from "./routes/products.js"; //CJS로 표현됨 users 파일로 가서, export default router
// MJS로 변경하면 default가 하나라면 import usersRouter from "./routes/users";
import articleRouter from "./routes/articles.js";
// import dotenv from "dotenv"; //env 읽어오기
import productImageRouter from "./routes/product-image.route.js";
///workspaces/sprint3/routes/product-image.route.js

//dotenv.config(); //경로 빼면 그냥 .env 읽는다.

const app = express();
app.use(cors());
//const apiPort = process.env.API_PORT;
const port = process.env.PORT || process.env.API_PORT;
if (!port) {
   console.error("❌ ERROR: Server port is not defined. Please set the PORT environment variable.");
   // 안전을 위해 기본 포트를 지정합니다.
   const defaultPort = 9700;
   console.log(`Setting default port to ${defaultPort}`);
   app.set("port", defaultPort);
} else {
   app.set("port", port);
}
// 무조건 세팅하기
app.set("json replacer", (key, value) => {
   if (typeof value === "bigint") {
      return value.toString();
   } // Bigint 일때만 스트링으로 바꿔
   return value;
});
// 파일 업로드
// 1. 정적 파일 서비스를 위한 설정 (필수!)
app.use("/uploads", express.static("uploads"));

// 2. 업로드 라우터 마운트
app.use("/products/:productId", productImageRouter);
//
// 본문 파싱한 것
app.use(express.json());

// 라우터 mount - 뜯어낸다. users는 users로.
app.use("/articles", articleRouter);
app.use("/products", productRouter);

// 기본 라우트
app.get("/", (req, res) => {
   res.json({
      message: "API Server", //나 API 서버고, 아티클, 프로덕트가 있어.
      endpoints: ["/articles", "/products"],
   });
});

//console.log(apiPort);
//env("API_PORT");  //.env에 있음 위에 임포트때 읽어와서 포트 등록된다
app.listen(app.get("port"), () => {
   console.log(`Server running on port ${app.get("port")}`);
});
