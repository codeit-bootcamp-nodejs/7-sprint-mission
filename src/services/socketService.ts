import { ExtendedError, Server, Socket } from 'socket.io';
import http from 'http';
import * as authService from './authService';
import { Notification } from '../lib/types/notification';
import { UserData } from '../lib/types/authType';

class SocketService {
    private io: Server;

    constructor() {
        this.io = new Server();
        this.io.use(this.authenticate);
    }

    initialize(httpServer: http.Server) {
        this.io.attach(httpServer);
    }

    sendNotification(notification: Notification) {
        const userId = notification.userId;
        this.io.to(userId.toString()).emit('notification', notification);
    }

    private async authenticate(socket: Socket, next: (err?: ExtendedError) => void) {
        let user: UserData;
        try {
            const accessToken = socket.handshake.auth.accessToken;
            user = await authService.authenticate(accessToken);
        } catch (error) {
            console.log('error', error);
            next(error as ExtendedError);
            return;
        }
        socket.join(user.id.toString());
        next();
    }
}

export default new SocketService();
