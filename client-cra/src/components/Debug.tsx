import { useState } from 'react';
import { App } from '../App';
import { socket } from '../socket';

export const Debug = () => {
    const [isConnectedNode, setIsConnectedNode] = useState(socket.connected);
    const [isConnectedBack, setIsConnectedBack] = useState(false);

    return (
        <>
            <h2>Debug</h2>
            <p>connected: {'' + isConnectedNode}</p>
            <p>connected to backend: {'' + isConnectedBack}</p>
            <App setIsConnectedNode={setIsConnectedNode} setIsConnectedBack={setIsConnectedBack} />
        </>
    );
};
