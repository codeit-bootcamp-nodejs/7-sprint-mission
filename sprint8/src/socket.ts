import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

// 소켓 초기화 함수
export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`사용자 접속: ${socket.id}`);

    socket.on('join', (userId: number) => {
      socket.join(`user-${userId}`);
      console.log(`사용자 ${userId}가 방 user-${userId}에 입장했습니다.`);
    });

    socket.on('disconnect', () => {
      console.log('사용자 접속 해제');
    });
  });

  return io;
};

// 특정 사용자에게 알림을 보내는 함수
export const sendNotificationToUser = (userId: number, data: any) => {
  if (!io) return;
  // 해당 유저의 방으로 알림 이벤트를 전송
  io.to(`user-${userId}`).emit('new_notification', data);
};