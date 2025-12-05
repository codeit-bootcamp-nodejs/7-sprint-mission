import pkg from "@prisma/client";
const { Prisma } = pkg;
import CustomError from "../utils/CustomError.js";
import { MulterError } from "multer";

export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof CustomError) {
    statusCode = err.status || 400;
    message = err.message;
  } else if (err instanceof MulterError) {
    statusCode = 400;
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "파일 크기가 너무 큽니다.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "허용되지 않은 파일입니다.";
        break;
      default:
        message =
          err.message || "파일 업로드 중 알 수 없는 오류가 발생했습니다.";
    }
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      message = "해당 리소스를 찾을 수 없습니다.";
    } else {
      statusCode = 400;
      message = `데이터베이스 오류가 발생했습니다: ${err.meta?.target || err.message}`;
    }
  } else {
    statusCode = err.status || 500;
    message = err.message || "Internal Server Error";
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;
