import { socket } from '@/lib/socket';
import { LoginMessage } from '../types';
import { SocketResponse } from '@/types/types';

export const login = async (loginMessage: LoginMessage): Promise<SocketResponse> => {
    console.log('logging in...');

    return await socket.emit('login', loginMessage);
};

export const initLogin = (callback: VoidFunction) => {
    socket.connect('initLogin', callback);
};
