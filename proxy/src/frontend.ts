import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { FrontListener } from './types/types';

const hostname = 'localhost';
const port = 3001;

export function createFrontend(): Server {
    const server = createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
    });

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
        },
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });

    return io;
}

export class ClientSocket {
    socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    addListener(eventListener: FrontListener) {
        this.socket.on(eventListener.ev, eventListener.listener);
    }

    removeListener(eventListener: FrontListener) {
        this.socket.off(eventListener.ev, eventListener.listener);
    }

    emit(ev: string, ...args: unknown[]) {
        this.socket.emit(ev, ...args);
    }

    sendError(error: unknown) {
        this.socket.emit('error', error);
    }

    readonly getToken = () => {
        return this.socket.handshake.auth?.token as string;
    };
}
