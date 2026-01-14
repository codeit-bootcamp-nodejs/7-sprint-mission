import { HttpError } from "../../errors/customErrors.js";

export function errorMiddleware(err, req, res, next) {

  let statusCode = 500;
  let message = "서버 오류가 발생했습니다.";

  if (err instanceof HttpError) {
    statusCode = err.statusCode ?? 500;
    message = err.message ?? message;
  }

  if (!(err instanceof HttpError)) {
    if (err?.code === "P2002") {
      statusCode = 409;
      const target = err?.meta?.target?.[0];

      if (target === "email") {
        message = "이미 사용 중인 이메일입니다.";
      } else if (target === "nickname") {
        message = "이미 사용 중인 닉네임입니다.";
      } else {
        message = "중복된 요청입니다.";
      }
    }

    if (err?.code === "P2025") {
      statusCode = 404;
      message = "요청한 데이터를 찾을 수 없습니다.";
    }

    if (err?.code === "P1000") {
      statusCode = 500;
      message = "데이터베이스 인증에 실패했습니다.";
    }

    if (err?.code === "P1001") {
      statusCode = 500;
      message = "데이터베이스 서버에 연결할 수 없습니다.";
    }

    if (err?.code === "P2003") {
      statusCode = 400;
      message = "요청한 데이터가 올바르지 않습니다.";
    }
  }

  res.status(statusCode).json({ message });
}
