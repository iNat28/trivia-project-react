import { BackendSocket } from './backend';
import { ClientSocket } from './frontend';
import { LoginMessage } from './types/types';
import { TokenType, generateToken } from './utils/token';

export class ConnectedUser {
    readonly backSocket: BackendSocket;
    frontSocket: ClientSocket;
    readonly token: TokenType;
    promise: Promise<void>;
    readonly userInfo: LoginMessage;
    disconnectTime: number;
    readonly disconnectFunc: VoidFunction;

    constructor(
        backSocket: BackendSocket,
        frontSocket: ClientSocket,
        userInfo: LoginMessage,
        disconnectFunc: VoidFunction,
    ) {
        this.backSocket = backSocket;
        this.frontSocket = frontSocket;
        this.userInfo = userInfo;
        this.token = generateToken(ConnectedUsers);
        this.disconnectTime = undefined;
        this.disconnectFunc = disconnectFunc;

        ConnectedUsers.set(this.token, this);
    }

    frontEndConnect = (frontSocket: ClientSocket) => {
        if (this.frontSocket) {
            throw Error('connected user already has front socket!');
        }

        this.disconnectTime = undefined;
        this.frontSocket = frontSocket;
    };

    frontEndDisconnect = () => {
        this.disconnectTime = Date.now();
        this.frontSocket = undefined;
    };

    disconnect = () => {
        console.log('removing user');
        ConnectedUsers.delete(this.token);
        this.disconnectFunc();
    };
}

export const ConnectedUsers = new Map<TokenType, ConnectedUser>();

const TIMEOUT = 1000 * 60 * 0.3;
const ITER_TIME = 1000 * 60 * 0.5;

async function ConnectedUsersManager() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const currTime = Date.now();

        ConnectedUsers.forEach((value) => {
            if (value.disconnectTime && currTime - value.disconnectTime > TIMEOUT) {
                value.disconnect();
            }
        });

        await new Promise((f) => setTimeout(f, ITER_TIME));
    }
}
ConnectedUsersManager();
