import { Client } from '../client-info';
import { Menu } from '../menu/menu';

export type Package = {
    code: Code;
    message?: string;
    [key: string]: unknown;
};

export interface Message {
    [key: string]: unknown;
}

export interface LoginMessage extends Message {
    username: string;
    password: string;
}

export interface LogoutMessage extends Message {
    username: string;
}

export type UserInfo = {
    isLoggedIn: boolean;
    username?: string;
    currMenu?: Menu;
};

export interface FrontListener {
    ev: string;
    listener: (message?: Message) => void;
}

export type MenuFunc = (client: Client) => Menu;

type PackageFunc = (msg?: Package) => void;
export type BackListener = Map<Code, PackageFunc>;

export type DataListener = (data: Buffer) => void;

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
