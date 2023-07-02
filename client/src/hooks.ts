/* eslint @typescript-eslint/no-restricted-imports: 0 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './stores/store';
import { useEffect } from 'react';
import { SocketListener } from './types/types';
import { socket } from './lib/socket';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppSelecterFunc<ReturnType> = (state: RootState) => ReturnType;

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
    }, []);

    return listeners;
};
