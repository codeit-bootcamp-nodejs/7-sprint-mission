export class HTTPError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HTTPError";
    this.status = status;
  }
}

export function errorHandler(err, req, res, next) {
  // 로그 출력 (실제 운영 환경에서는 로거 라이브러리 사용 권장)
  console.error(err);

  // 직접 발생시킨 커스텀 HTTPError 처리
  if (err instanceof HTTPError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Prisma: 레코드를 찾을 수 없음 (P2025)
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  // Multer: 파일 타입 제한
  if (err.code === "LIMIT_FILE_TYPES") {
    return res.status(400).json({ error: err.message });
  }

  // 그 외 서버 에러
  res.status(500).json({ error: err.message || "Internal Server Error" });
}
