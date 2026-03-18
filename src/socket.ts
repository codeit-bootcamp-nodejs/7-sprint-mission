import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

let io: Server | null = null;

// Socket.IO 서버 초기화
export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
    });
  });

  return io;
}

// 다른 곳에서 io 가져다 쓰기
export function getIo(): Server {
  if (!io) {
    throw new Error('Socket.IO가 초기화되지 않았습니다.');
  }

  return io;
}