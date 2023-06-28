import { io } from 'socket.io-client';
import store from './store';
import { LoginStatus, saveUserInfo, setBackendStatus, setLoginStatus, setProxyStatus } from './clientSlice';

const URL = 'http://localhost:3001';

export const socket = io(URL, {
    autoConnect: true,
});

function init() {
    socket.on('connect', () => {
        console.log('connected to proxy');
        store.dispatch(setProxyStatus(true));
    });
    socket.on('connect-backend-success', () => store.dispatch(setBackendStatus(true)));
    socket.on('error-connecting-backend', () => store.dispatch(setBackendStatus(false)));
    socket.on('disconnect', () => {
        store.dispatch(setProxyStatus(false));
        store.dispatch(setBackendStatus(false));
    });
    socket.on('login-success', () => {
        console.log('login success!');
        store.dispatch(setLoginStatus(LoginStatus.LoggedIn));
        store.dispatch(saveUserInfo());
    });
    socket.on('error', (err) => {
        console.log('error: ', err);
    });
}
init();

export function login(loginInfo: LoginInfo) {
    console.log('logging into backend...');
    socket.emit('login', loginInfo);
}

export interface LoginInfo {
    username: string;
    password: string;
}

interface UserInfo {
    isLoggedIn: boolean;
    username?: string;
}

export const client: UserInfo = {
    isLoggedIn: false,
};
