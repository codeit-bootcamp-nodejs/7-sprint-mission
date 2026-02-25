// src/lib/socket.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from './token';

let io: SocketIOServer;
const userSockets = new Map<number, string>(); 

export function initSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: { origin: '*' } 
  });

  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (token) {
      const payload = verifyToken(token as string);
      if (payload) {
        userSockets.set(payload.id, socket.id);
        console.log(`User ${payload.id} connected with socket ${socket.id}`);
      }
    }

    socket.on('disconnect', () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });
}

export function sendNotificationToUser(userId: number, notification: any) {
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit('notification', notification);
  }
}