import { socket } from '@/lib/socket';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export interface Message {
    [key: string]: string;
}

export type SocketListener = Parameters<typeof socket.addListener>;

export type SocketResponse = {
    statusCode: StatusCodes;
    reason: ReasonPhrases | string;
};
