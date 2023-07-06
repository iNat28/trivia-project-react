import { socket } from '@/lib/socket';
import { SocketResponse } from '@/types/types';

export const logout = async (): Promise<SocketResponse> => {
    console.log('logging out...');
    return await socket.emit('logout');
};
