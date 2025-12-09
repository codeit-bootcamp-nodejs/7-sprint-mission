import { CustomError } from "../middlewares/CustomError.js";

const errorHandler = (err, req, res, next) => {
  console.error("[Error Log]", err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ message: "해당 데이터를 찾을 수 없습니다." });
  }

  res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
};

export default errorHandler;
