import express from "express";
import articleRouter from "./routes/article.route.js";
import productRouter from "./routes/product.route.js";
import { HttpError } from "./errors/customErrors.js";
import cors from "cors";
//근데 import방식은 import순서대로 진행이 되기 때문에 import 이전에 서버가 열리면 적용이 안 될 수도 있음.
//config도 마찬가지이기 때문에 권장하는 방식이 따로 있음.
import { config } from "dotenv";
config();

// 클라이언트가 서버로 요청을 보내면 JSON형식의 문자열로 요청을 보내게 됨.
// 그럼 서버에서는 이 JSON 문자열을 다시 자바스크립트 객체로 변환을 해야겠지?
// 그게 express.json()임. 번역기라고 생각하면 됨.
const app = express();

app.use(express.json());
app.use(cors());

// 역직렬화 로직 => JSON 문자열을 JS 객체나 배열로 변경해줌
// !중요 사항! 역직렬화가 있다면 직렬화 로직은 붙어다니는 한쌍이다. 왜? 변환한 JS 객체를 클라이언트에게 응답 시 다시 JSON으로 바꿔줘야 하니깐.
// res.json()이 직렬화 변환 응답. res.json() -> res.stringify() -> send(JSON)
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

// 라우터 mount
// 이거는 첫번째 인자에는 해당 경로, 두번째 인자에는 처리 할 객체를 넣어줌.
// 그래서 해당 경로에 온 모든 요청들을 해당 라우터 객체로 일 처리를 다 짬 때림.
app.use("/api/articles", articleRouter);
app.use("/api/products", productRouter);

app.get("/", (req, res) => {
  res.json({
    message: "RESTful API Server",
    endpoints: ["/articles", "/products"],
  });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);

  // HttpError 인스턴스인 경우 (400, 404 등 커스텀 에러)
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  // Prisma 에러 처리
  if (err.code) {
    // Prisma unique constraint violation
    if (err.code === "P2002") {
      return res.status(400).json({
        error: {
          message: "이미 존재하는 데이터입니다.",
          statusCode: 400,
        },
      });
    }
    // Prisma record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        error: {
          message: "요청한 데이터를 찾을 수 없습니다.",
          statusCode: 404,
        },
      });
    }
  }

  // 기본 500 에러 (예상치 못한 에러)
  res.status(500).json({
    error: {
      message: "서버 내부 오류가 발생했습니다.",
      statusCode: 500,
    },
  });
});

// process.env(환경변수)를 사용하기 위해서는 Dotenv라는 Node.js 패키지를 불러와야 함.
const apiPort = process.env.API_PORT;
app.listen(apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
});

// 미들웨어란 - 클라이언트에게 요청을 받고 전달되기 전까지 실행되는 함순.
