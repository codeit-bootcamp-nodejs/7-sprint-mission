import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../lib/jwt';

class SocketService {
  private io: SocketIOServer | null = null;

  initialize(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: { origin: '*' },
    });

    this.io.use((socket: Socket, next) => {
      const token =
        socket.handshake.auth.token ??
        socket.handshake.headers['authorization']?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('인증이 필요합니다'));
      }

      try {
        const payload = verifyAccessToken(token);
        (socket as any).userId = payload.userId;
        next();
      } catch {
        next(new Error('유효하지 않은 토큰입니다'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = (socket as any).userId as number;
      socket.join(`user:${userId}`);
      console.log(`소켓 연결됨: userId=${userId}`);

      socket.on('disconnect', () => {
        console.log(`소켓 연결 해제됨: userId=${userId}`);
      });
    });
  }

  emitToUser(userId: number, event: string, data: unknown) {
    if (!this.io) return;
    this.io.to(`user:${userId}`).emit(event, data);
  }
}

export default new SocketService();
