import { CustomError } from "../middlewares/CustomError.js";

const errorHandler = (err, req, res, next) => {
  console.error("[Error]", err);

  // 1. 커스텀 에러 (ValidationError, NotFoundError 등) 처리
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // 2. Prisma 관련 에러 처리 (예시)
  // P2025: 레코드를 찾을 수 없음 (주로 update/delete 시 발생)
  if (err.code === "P2025") {
    return res.status(404).json({
      message: "해당 데이터를 찾을 수 없습니다.",
    });
  }

  // 3. 그 외 알 수 없는 서버 에러
  res.status(500).json({
    message: "서버 내부 오류가 발생했습니다.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

export default errorHandler;
