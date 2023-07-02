import { io, Socket as SocketIO } from 'socket.io-client';
import { Message } from '@/types/types';

const URL = 'http://localhost:3001';

class Socket {
    readonly socket: SocketIO;

    constructor() {
        this.socket = io(URL, {
            autoConnect: true,
        });

        this.socket.on('error', (err) => {
            console.log('socket error: ', err);
        });
    }

    readonly init = async () => {};

    readonly emit = async (ev: string, message: Message) => {
        if (!this.socket.connected) {
            return 'unable to emit: proxy not connected';
        }

        try {
            const response: string = await this.socket.timeout(2000).emitWithAck(ev, message);
            console.log(response);
            return response;
        } catch (err) {
            return 'error - timeout';
        }
    };

    readonly addListener = (ev: string, listener: () => void) => {
        this.socket.on(ev, listener);
    };

    readonly removeListener = (ev: string, listener: () => void) => {
        this.socket.off(ev, listener);
    };
}

export const socket = new Socket();
