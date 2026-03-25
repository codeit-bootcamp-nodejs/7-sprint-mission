import dotenv from "dotenv";

// 🔥 환경별 env 로딩
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

import { createServer } from "http";
import { PORT } from "./lib/constants";
import app from "./app";
import socketService from "./services/socketService";

const server = createServer(app);

// 🔥 테스트 환경에서는 서버 실행 안함
if (process.env.NODE_ENV !== "test") {
  socketService.initialize(server);

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

export default server;