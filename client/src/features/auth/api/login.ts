import { socket } from '@/lib/socket';
import { LoginMessage, LoginInfo } from '../types';
import { SocketResponse } from '@/types/types';

export const login = async (userInfo: LoginInfo): Promise<SocketResponse> => {
    console.log('logging in...');

    const loginMessage: LoginMessage = {
        username: userInfo.username,
        password: userInfo.password,
    };

    return await socket.emit('login', loginMessage);
};

export const initLogin = (callback: VoidFunction) => {
    socket.connect('initLogin', callback);
};
