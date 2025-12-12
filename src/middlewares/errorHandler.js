import { HttpError } from "../errors/coustomErrors.js";

export const errorHandler = (err, req, res, next) => {
  console.log(err);
  console.log(err.stack);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  // prisma 에러
  if (err.code) {
    // prisma unique constraint violation
    if (err.code === "P2002") {
      return res.status(400).json({
        error: {
          message: "이미 존재하는 데이터입니다.",
          statusCode: 400,
        },
      });
    }
    // prisma record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        error: {
          message: "요청한 데이터를 찾을 수 없습니다.",
          statusCode: 404,
        },
      });
    }
  }

  return res.status(500).json({
    error: {
      message: "서버 내부 오류가 발생했습니다.",
      statusCode: "500",
    },
  });
};
