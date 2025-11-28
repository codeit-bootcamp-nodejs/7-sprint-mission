import express from "express";
//근데 import방식은 import순서대로 진행이 되기 때문에 import 이전에 서버가 열리면 적용이 안 될 수도 있음.
import dotenv from "dotenv";
import articleRouter from "./routes/article.js";
import productRouter from "./routes/product.js";

//config도 마찬가지이기 때문에 권장하는 방식이 따로 있음.
dotenv.config();

const app = express();

// bigInt의 경우는 데이터베이스에서 다루는 정수의 크기가 커서 큰 정수를 다루기 위해 자바스크립트에서 도입 됨.
// 근데 클라이언트는 JSON으로 요청을 보낸다고 했지? 근데 JSON에는 bigInt가 없음.
// 그래서 서버 충돌을 하게 됨. 그래서 bigInt 데이터 타입이면 문자열로 변환하여 응답을 해줌.
// 이 로직은 _라는 키값 value라는 벨류값을 받아서 value값이 bigInt인지 아닌지를 확인하고 value를 리턴하는 로직.
// 첫번째 인자는 그냥 입력 받지만 무시, 쓸모 없음.
const bigIntToStringOrBypass = (_, value) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

// 클라이언트가 서버로 요청을 보내면 JSON형식의 문자열로 요청을 보내게 됨.
// 그럼 서버에서는 이 JSON 문자열을 다시 자바스크립트 객체로 변환을 해야겠지?
// 그게 express.json()임. 번역기라고 생각하면 됨.
app.use(express.json());

// 라우터 mount
// 이거는 첫번째 인자에는 해당 경로, 두번째 인자에는 처리 할 객체를 넣어줌.
// 그래서 해당 경로에 온 모든 요청들을 해당 라우터 객체로 일 처리를 다 짬 때림.
app.use("/articles", articleRouter);
app.use("/products", productRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API Server",
    endpoints: ["/article", "/product"],
  });
});

// process.env(환경변수)를 사용하기 위해서는 Dotenv라는 Node.js 패키지를 불러와야 함.
const apiPort = process.env.API_PORT;
app.listen(apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
});

// 미들웨어란 - 클라이언트에게 요청을 받고 전달되기 전까지 실행되는 함순.
