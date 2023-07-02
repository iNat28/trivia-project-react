import { isConnectedBack, isConnectedProxy, setBackendStatus, setProxyStatus } from '../slices/debugSlice';
import { useAppSelector, useListeners } from '../../../hooks';
import { JSX, useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useDispatch } from 'react-redux';
import { SocketListener } from '@/types/types';

type Props = {
    children: JSX.Element;
};
export const Debug: React.FC<Props> = ({ children }: Props): JSX.Element => {
    const _isConnectedProxy = useAppSelector(isConnectedProxy);
    const _isConnectedBack = useAppSelector(isConnectedBack);
    const dispatch = useDispatch();

    useListeners([
        [
            'connect',
            () => {
                console.log('connected to proxy');
                dispatch(setProxyStatus(true));
            },
        ],
        [
            'connect-backend-success',
            () => {
                console.log('connected to backend');
                dispatch(setBackendStatus(true));
            },
        ],
        [
            'error-connecting-backend',
            () => {
                console.log('error connecting to backend');
                dispatch(setBackendStatus(false));
            },
        ],
    ]);

    return (
        <>
            <h2>Debug</h2>
            <p>connected: {'' + _isConnectedProxy}</p>
            <p>connected to backend: {'' + _isConnectedBack}</p>
            {children}
        </>
    );
};
