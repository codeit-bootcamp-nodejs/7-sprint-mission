import app from './app';
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://web.postman.co'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('유저 연결됨:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`유저 ${userId}가 방에 입장했습니다.`);
  });

  socket.on('disconnect', () => {
    console.log('유저 연결 끊김:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}
