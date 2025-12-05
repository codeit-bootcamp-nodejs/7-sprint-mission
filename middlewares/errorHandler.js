// Express에서 에러를 최종적으로 처리하는 미들웨어로,
// 커스텀 에러를 인식하고 적절한 HTTP 상태 코드와 JSON 응답을 반환
import { CustomError } from "../utils/CustomErrors.js";

export function errorHandler(err, req, res, next) {
  console.error(err);
  //커스텀 에러 처리
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  //prisma 에러 처리
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

  // 예상치 못한 에러 - 자세한 정보 숨김
  return res.status(500).json({
    error: {
      message: "서버 오류가발생했습니다",
      statusCode: 500,
    },
  });
}
