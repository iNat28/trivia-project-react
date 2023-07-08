/* eslint-disable @typescript-eslint/no-explicit-any */
import { socket } from '@/lib/socket';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export interface Message {
    [key: string]: string;
}

export type SocketListenerFunc = (...args: any[]) => void;
export type SocketListener = Parameters<typeof socket.addListener>;

export type SocketResponse = {
    statusCode: StatusCodes;
    reason?: ReasonPhrases | string;
    other?: any;
};

export type UserInfo = {
    username: string;
};
