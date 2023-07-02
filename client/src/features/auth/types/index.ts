import { Message } from '@/types/types';

export enum LoginStatus {
    LoggedIn,
    LoggedOut,
    Pending,
    Error,
}

export interface LoginMessage extends Message {
    username: string;
    password: string;
}
