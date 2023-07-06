import { io, Socket as SocketIO } from 'socket.io-client';
import { Message, SocketResponse } from '@/types/types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const URL = 'http://localhost:3001';

class Socket {
    readonly socket: SocketIO;
    connectionStatus: 'connected' | 'pending' | 'disconnected' | 'error' = 'pending';
    connectionCallbacks: Map<string, VoidFunction> = new Map<string, VoidFunction>();

    constructor() {
        this.socket = io(URL, {
            autoConnect: false,
        });

        this.socket.on('error', (err) => {
            console.log('socket error: ', err);
        });

        this.socket.on('connect', () => {
            this.connectionStatus = 'connected';
        });

        this.socket.on('connect-error', () => {
            this.connectionStatus = 'error';
        });

        this.socket.on('disconnect', (reason) => {
            console.log('disconnected:', reason);
            this.connectionStatus = 'disconnected';
        });
    }

    readonly connect = (callback: VoidFunction, key: string) => {
        const _callback = () => {
            callback();
            this.connectionCallbacks.delete(key);
        };

        if (this.connectionCallbacks.has(key)) {
            this.socket.off('connect', this.connectionCallbacks.get(key));
        }

        this.socket.connect();
        this.socket.on('connect', _callback);
        this.connectionCallbacks.set(key, _callback);
    };

    readonly emit = async (ev: string, message?: Message): Promise<SocketResponse> => {
        if (this.connectionStatus === 'disconnected' || this.connectionStatus === 'error') {
            return {
                statusCode: StatusCodes.SERVICE_UNAVAILABLE,
                reason: ReasonPhrases.SERVICE_UNAVAILABLE,
            };
        }

        if (this.connectionStatus === 'pending') {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (this.connectionStatus !== 'connected') {
            return {
                statusCode: StatusCodes.SERVICE_UNAVAILABLE,
                reason: ReasonPhrases.SERVICE_UNAVAILABLE,
            };
        }

        try {
            const response: SocketResponse = await this.socket.timeout(2000).emitWithAck(ev, message);
            console.log('socket response: ', response);
            return response;
        } catch (err) {
            return {
                statusCode: StatusCodes.REQUEST_TIMEOUT,
                reason: ReasonPhrases.REQUEST_TIMEOUT,
            };
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
