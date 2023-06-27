import { io } from 'socket.io-client';

export const socket = io('http://localhost:3001', {
    autoConnect: true,
});

export interface LoginInfo {
    username: string;
    password: string;
}

export let loginInfo: LoginInfo | undefined = undefined;
export function setLoginInfo(_loginInfo: LoginInfo | undefined) {
    loginInfo = _loginInfo;
}

export const login = () => {
    console.log('logging into backend...');
    socket.emit('login', loginInfo);
};

interface UserInfo {
    isLoggedIn: boolean;
    username?: string;
}

export const client: UserInfo = {
    isLoggedIn: false,
};
