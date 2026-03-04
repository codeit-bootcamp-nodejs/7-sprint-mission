import { ExtendedError, Server, Socket } from 'socket.io';
import * as http from 'http';
import * as authService from './authService';
import { Notification } from '@prisma/client';

class SocketService {   
    private io: Server;
    constructor() {
        this.io = new Server();
        this.io.use(this.authenticate);
    }   
    private async authenticate(socket : Socket, next: (err?: ExtendedError) => void) {
        try{
            const accsessToken = socket.handshake.auth.accessToken;
            const user = await authService.authenticate(accsessToken);
            socket.join(user.id.toString());
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