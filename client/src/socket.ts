import { io } from 'socket.io-client';
import store from './store';
import { LoginStatus, login, saveUserInfo, setBackendStatus, setLoginStatus, setProxyStatus } from './clientSlice';
import { lookupUserInfo } from './storage';

const URL = 'http://localhost:3001';

export const socket = io(URL, {
    autoConnect: true,
});

function init() {
    socket.on('connect', () => {
        console.log('connected to proxy');
        store.dispatch(setProxyStatus(true));
    });
    socket.on('connect-backend-success', () => {
        console.log('connected to backend');
        store.dispatch(setBackendStatus(true));

        const storedUserInfo = lookupUserInfo();
        if (storedUserInfo) {
            store.dispatch(login(storedUserInfo));
        }
    });
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

export interface LoginInfo {
    username: string;
    password: string;
}

export function attemptLogin(loginInfo: LoginInfo) {
    if (!socket.connected) {
        console.log('unable to login: proxy not connected');
        return false;
    }

    console.log('logging into backend...');
    socket.emit('login', loginInfo);
    return true;
}

interface UserInfo {
    isLoggedIn: boolean;
    username?: string;
}

export const client: UserInfo = {
    isLoggedIn: false,
};
