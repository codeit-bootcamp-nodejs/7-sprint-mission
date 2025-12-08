export function errorHandler(err, req, res, next) {
  console.error("❌ ERROR:", err);

  if (err.code === "P2025") {
    return res.status(404).json({ error: "리소스를 찾을 수 없습니다." });
  }

  res.status(500).json({
    error: "서버 내부 오류 발생",
  });
}
