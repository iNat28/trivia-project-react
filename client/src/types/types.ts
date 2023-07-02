import { socket } from '@/lib/socket';

export interface Message {
    [key: string]: string;
}

export type SocketListener = Parameters<typeof socket.addListener>;
