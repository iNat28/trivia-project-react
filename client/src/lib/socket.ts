import { io, ManagerOptions, Socket as SocketIO, SocketOptions } from 'socket.io-client';
import { Message, SocketListenerFunc, SocketResponse } from '@/types/types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { getToken } from '@/utils/token';

const URL = 'http://localhost:3001';

class Socket {
    readonly socket: SocketIO;
    connectionStatus: 'connected' | 'pending' | 'disconnected' | 'error' = 'pending';
    connectionCallbacks: Map<string, VoidFunction> = new Map<string, VoidFunction>();
    readonly token?: string;

    constructor() {
        const socketOptions: Partial<SocketOptions & ManagerOptions> = {
            autoConnect: true,
        };
        const token = getToken();
        if (token) {
            this.token = token;
            socketOptions.auth = { token };
        }

        this.socket = io(URL, socketOptions);

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

    readonly connect = (key: string, callback: VoidFunction) => {
        const _callback = () => {
            callback();
            this.connectionCallbacks.delete(key);
        };

        if (this.connectionCallbacks.has(key)) {
            this.socket.off('connect', this.connectionCallbacks.get(key));
        }

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

    readonly addListener = (ev: string, listener: SocketListenerFunc) => {
        this.socket.on(ev, listener);
    };

    readonly removeListener = (ev: string, listener: SocketListenerFunc) => {
        this.socket.off(ev, listener);
    };
}

export const socket = new Socket();
