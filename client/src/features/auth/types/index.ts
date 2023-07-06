import { Message } from '@/types/types';

export enum LoginStatus {
    LoggedIn,
    LoggedOut,
    Pending,
    Error,
    Init,
}

export interface LoginMessage extends Message {
    username: string;
    password: string;
}

export interface UserInfo {
    username: string;
    password: string;
}
