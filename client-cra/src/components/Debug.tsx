import { isConnectedBack, isConnectedProxy } from '../clientSlice';
import { useAppSelector } from '../hooks';
import { JSX } from 'react';

type Props = {
    children: JSX.Element;
};
export const Debug: React.FC<Props> = ({ children }: Props): JSX.Element => {
    const _isConnectedProxy = useAppSelector(isConnectedProxy);
    const _isConnectedBack = useAppSelector(isConnectedBack);

    return (
        <>
            <h2>Debug</h2>
            <p>connected: {'' + _isConnectedProxy}</p>
            <p>connected to backend: {'' + _isConnectedBack}</p>
            {children}
        </>
    );
};
