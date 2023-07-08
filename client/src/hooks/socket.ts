import { SocketListener } from '@/types/types';
import { useEffect } from 'react';
import { socket } from '@/lib/socket';

export const useListeners = (listeners: SocketListener[]) => {
    useEffect(() => {
        listeners.forEach((listener) => {
            socket.addListener(...listener);
        });

        return () => {
            listeners.forEach((listener) => {
                socket.removeListener(...listener);
            });
        };
    }, [listeners]);

    return listeners;
};

export const useListenersOnce = (listeners: SocketListener[]) => {
    useEffect(() => {
        listeners.forEach((listener) => {
            socket.socket.once(...listener);
        });

        return () => {
            listeners.forEach((listener) => {
                socket.removeListener(...listener);
            });
        };
    }, [listeners]);

    return listeners;
};
