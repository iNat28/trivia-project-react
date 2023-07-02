import { socket } from '@/lib/socket';
import { LoginMessage } from '../types';
import storage from '@/utils/storage';

export const login = async (loginInfo: LoginMessage) => {
    return await socket.emit('login', loginInfo);
};

export const storeUserInfo = (userInfo: LoginMessage) => storage.store('user_info', userInfo);
export const lookupUserInfo = () => {
    const userInfo = storage.lookup('user_info');
    if (userInfo) {
        return userInfo as LoginMessage;
    }
    return null;
};
