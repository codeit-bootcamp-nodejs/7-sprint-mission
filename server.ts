import http from "http";
import app from "./app.js";
import { initSocket } from "./src/socket.js";

const PORT = process.env.API_PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});