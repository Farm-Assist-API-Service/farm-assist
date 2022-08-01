import { Server } from 'socket.io';
import { APP_VAR } from '../configs';

export default function webSocket(httpServer: any) {
    const socket = new Server(httpServer, {
        cors: {
            origin: APP_VAR.allowedURL[0],
            methods: ['GET', 'POST']
        }
    });

    socket.on('connection', async (socket) => {
        console.log(`${socket.id} connected!`);
       try {
            socket.emit('broadcast', 'Good moring!');
       } catch (error) {
           return error;
       }
    });

    return socket;
}