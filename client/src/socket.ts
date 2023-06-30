import { io } from 'socket.io-client';
import store from './store';
import {
    LoginStatus,
    saveUserInfo,
    setBackendStatus,
    setErrorMsg,
    setLoginStatus,
    setProxyStatus,
    setStoredUserInfo,
    tryLogin,
} from './clientSlice';
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
    socket.on('connect-backend-success', async () => {
        console.log('connected to backend');
        store.dispatch(setBackendStatus(true));

        const storedUserInfo = lookupUserInfo();
        if (storedUserInfo) {
            store.dispatch(setStoredUserInfo(storedUserInfo));
            await store.dispatch(tryLogin(storedUserInfo));
        }
    });
    socket.on('error-connecting-backend', () => {
        store.dispatch(setBackendStatus(false));
        // store.dispatch(setLoginStatus(LoginStatus.Error));
    });
    socket.on('disconnect', () => {
        store.dispatch(setProxyStatus(false));
        store.dispatch(setBackendStatus(false));
        // store.dispatch(setLoginStatus(LoginStatus.Error));
    });
    /*
    socket.on('login-success', () => {
        console.log('login success!');
        store.dispatch(setLoginStatus(LoginStatus.LoggedIn));
        store.dispatch(saveUserInfo());
    });
    */
    socket.on('error', (err) => {
        console.log('error: ', err);
    });
    /*
    socket.on('error-logging-in', (msg) => {
        store.dispatch(setLoginStatus(LoginStatus.Error));
        if (msg?.message) {
            store.dispatch(setErrorMsg(msg.message));
        }
    });
    */
}
init();

export interface LoginInfo {
    username: string;
    password: string;
}

export async function attemptLogin(loginInfo: LoginInfo) {
    if (!socket.connected) {
        return 'unable to login: proxy not connected';
    }

    try {
        const response: string = await socket.timeout(2000).emitWithAck('login', loginInfo);
        console.log(response);
        return response;
    } catch (err) {
        return 'error - timeout';
    }

    /*
    result.x = socket.timeout(2000).emitWithAck('login', loginInfo, (err: unknown, loggedIn: boolean) => {
        if (err) {
            console.log(err);
            return;
        }

        result.loggedIn = loggedIn;
    });
    */
}

interface UserInfo {
    isLoggedIn: boolean;
    username?: string;
}

export const client: UserInfo = {
    isLoggedIn: false,
};
