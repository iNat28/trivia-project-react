import { Client } from '../client-info';
import { Menu } from '../menu/menu';

export type Package = {
    readonly code: Code;
    readonly message?: string;
    readonly [key: string]: unknown;
};

export interface Message {
    readonly [key: string]: unknown;
}

export interface LoginMessage extends Message {
    readonly username: string;
    readonly password: string;
}

export interface LogoutMessage extends Message {
    readonly username: string;
}

export interface ErrorMessage extends Message {
    readonly message: string;
}

export type FrontCallback = (...args: unknown[]) => unknown;

export interface FrontListener {
    readonly ev: string;
    readonly listener: (message: Message, callback: FrontCallback) => void;
}

export type MenuFunc = (client: Client) => Menu;

export type PackageFuncArgs<T extends Message> = {
    frontMessage?: T;
    backMessage?: string;
};
type PackageFunc = (obj: PackageFuncArgs<Message>) => string;
export type BackListener = Map<Code, PackageFunc>;
export const BackListenerMap = Map<Code, PackageFunc>;

export type DataListener = (data: Buffer) => void;

export type BackendWriteOpts = {
    code: Code;
    obj: object;
};

export enum Code {
    ERROR_CODE = 0,

    //Login
    LOGIN = 10,
    SIGNUP,
    LOGOUT,

    //Menu
    GET_ROOM = 20,
    GET_PLAYERS_IN_ROOM,
    JOIN_ROOM,
    CREATE_ROOM,

    //Statistics
    USER_STATS,
    HIGH_SCORES,

    //Room
    GET_ROOM_STATE = 30,

    //RoomAdmin
    CLOSE_ROOM,
    START_GAME,

    //RoomMember
    LEAVE_ROOM,

    //Game
    GET_GAME_RESULTS,
    SUBMIT_ANSWER,
    GET_QUESTION,
    LEAVE_GAME,
}
