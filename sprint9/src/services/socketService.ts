import { ExtendedError, Server, Socket } from 'socket.io';
import * as http from 'http';
import * as authService from './authService';
import { Notification } from '@prisma/client';

class SocketService {   
    private io: Server;
    constructor() {
        this.io = new Server( {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.io.use(this.authenticate);
    }   
    private async authenticate(socket : Socket, next: (err?: ExtendedError) => void) {
        try{
            const accessToken = socket.handshake.auth.accessToken;
            const decoded = await authService.verifyAccessToken(accessToken);
            if (!decoded || typeof decoded === 'boolean') {
                throw new Error('Invalid access token');
            }
            const userId = (decoded as { id: number }).id;
            socket.data.user = { id: userId };
            socket.join(userId.toString());
            next();
        }catch(error){
            console.error(error);
            next(error as ExtendedError);
            return;
        }
    }

  initialize(httpServer : http.Server) {
    this.io.attach(httpServer);
  } 

  sendNotification(notification:Notification) {
    const userId = notification.userId;
    this.io.to(userId.toString()).emit('notification', notification);
  }
}

export default new SocketService(); 