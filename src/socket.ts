import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 🔥 클라이언트가 자기 userId로 room에 들어가게 함
    socket.on('join', (userId: number) => {
       console.log("🔥 join 이벤트 들어옴:", userId);
      socket.join(String(userId));
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket not initialized');
  }
  return io;
}