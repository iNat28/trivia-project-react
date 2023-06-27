import { Menu } from '../menu/menu';
import { Client } from '../client-info';

export type Package = {
    code: number;
    message?: string;
    [key: string]: unknown;
};

export interface Message {
    [key: string]: unknown;
}

export interface LogIn extends Message {
    username: string;
    password: string;
}

export interface LogOut extends Message {
    username: string;
}

export type UserInfo = {
    isLoggedIn: boolean;
    username?: string;
    currMenu?: Menu;
};

export type feListenerSelf = (self: Client, message?: Message) => void;
export type feListener = (message?: Message) => void;

export interface feEventListener {
    ev: string;
    listener: feListener;
}

export interface feEventListenerSelf {
    ev: string;
    listener: feListenerSelf;
}

export type DataListener = (data: Buffer) => void;
export type DataListenerSelf = (self: Client, data: Buffer) => void;

export type DataFunc = (data: Buffer) => void;
