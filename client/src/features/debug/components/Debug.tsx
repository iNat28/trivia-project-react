import { isConnectedBack, isConnectedProxy, setBackendStatus, setProxyStatus } from '../slices';
import { useAppDispatch, useAppSelector, useListeners } from '@/hooks';
import { FC, JSX } from 'react';

export const Debug: FC = (): JSX.Element => {
    const _isConnectedProxy = useAppSelector(isConnectedProxy);
    const _isConnectedBack = useAppSelector(isConnectedBack);
    const dispatch = useAppDispatch();

    useListeners([
        [
            'connect',
            () => {
                console.log('connected to proxy');
                dispatch(setProxyStatus(true));
            },
        ],
        [
            'disconnect',
            () => {
                console.log('disconnected from proxy and backend');
                dispatch(setProxyStatus(false));
                dispatch(setBackendStatus(false));
            },
        ],
        [
            'backend-status',
            (backendErrorMessage: string) => {
                console.log(backendErrorMessage);

                if (backendErrorMessage) {
                    console.log('error connecting to backend:', backendErrorMessage);
                    dispatch(setBackendStatus(false));
                    return;
                }

                console.log('connected to backend');
                dispatch(setBackendStatus(true));
            },
        ],
    ]);

    return (
        <>
            <h2>Debug</h2>
            <p>connected: {'' + _isConnectedProxy}</p>
            <p>connected to backend: {'' + _isConnectedBack}</p>
        </>
    );
};
