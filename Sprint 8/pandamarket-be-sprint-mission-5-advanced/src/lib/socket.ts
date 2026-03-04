// lib/socket.ts 예시
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

  io.on('connection', (socket) => {
    // 특정 유저의 Room에 join 시켜 해당 유저에게만 알림을 보낼 수 있게 함
    const userId = socket.handshake.query.userId;
    if (userId) socket.join(`user_${userId}`);
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
