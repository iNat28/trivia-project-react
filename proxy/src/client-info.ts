import { Socket } from 'socket.io';
import { BackendSocket } from './backend';
import { ClientSocket } from './frontend';
import { Menu } from './menu/menu';
import { MenuManager } from './menu/menu-manager';
import {
    BackListener,
    BackendWriteOpts,
    ClientResponse,
    Code,
    FrontCallback,
    LoginMessage,
    MenuFunc,
    Message,
    Package,
    isClientResponse,
} from './types/types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ConnectedUser, ConnectedUsers } from './connected-users';
import { TokenType } from './utils/token';

export class Client {
    readonly frontSocket: ClientSocket;
    readonly id: string;
    readonly menus: MenuManager;
    backSocket: BackendSocket;

    currMenu?: Menu;
    connectedUser?: ConnectedUser;

    static sockets = new Map<string, Client>();

    constructor(socket: Socket) {
        this.frontSocket = new ClientSocket(socket);
        this.id = socket.id;
        this.menus = new MenuManager(this);
        Client.sockets.set(this.id, this);

        this.backSocket = new BackendSocket(socket.id); // doesn't auto connect
    }

    readonly init = async () => {
        this.backSocket.socket.stream.on('close', () => {
            console.log('closed backend for client');
        });

        this.backSocket.socket.stream.on('error', (err) => {
            console.log('error: ');
            console.log(err);
            this.frontSocket.emit('error-connecting-backend');
        });

        this.frontSocket.socket.on('disconnect', async () => {
            this.remove();
            console.log('user disconnected, total sockets count:', Client.sockets.size);
            if (this?.connectedUser) {
                this.connectedUser.frontEndDisconnect();
                return;
            }

            this.backSocket.close();
        });

        const authToken = this.frontSocket.getToken();

        if (authToken && ConnectedUsers.has(authToken)) {
            console.log('user has backend');

            const connectedUser = ConnectedUsers.get(authToken);

            if (!connectedUser.frontSocket) {
                this.switchMenu(this.menus.main);
                this.frontSocket.emit('connect-backend-success');
                this.frontSocket.emit('login-success', { username: connectedUser.userInfo.username });
                connectedUser.frontEndConnect(this.frontSocket);
                this.backSocket = connectedUser.backSocket;
                this.connectedUser = connectedUser;

                return;
            }
        }

        this.backSocket.connect().then(async (value) => {
            console.log('value: ', value);
            this.frontSocket.emit(value);
            this.frontSocket.emit('login-none');
        });
    };

    static readonly login = async (connectedUser: ConnectedUser): Promise<ClientResponse> => {
        const writeResponse = await connectedUser.backSocket.write({
            code: Code.LOGIN,
            obj: connectedUser.userInfo,
        });

        if (writeResponse.statusCode !== StatusCodes.OK) {
            return writeResponse;
        }

        const readResponse = await connectedUser.backSocket.read();

        if (isClientResponse(readResponse)) {
            return readResponse;
        }

        const backPackage: Package = BackendSocket.decodeData(readResponse as Buffer);
        console.log(backPackage);

        if (backPackage.code === Code.LOGIN) {
            return {
                statusCode: StatusCodes.OK,
            };
        }

        console.log('error', backPackage);
        const response: ClientResponse = {
            statusCode: StatusCodes.BAD_GATEWAY,
            reason: ReasonPhrases.BAD_GATEWAY,
        };
        if (backPackage?.message) {
            response.reason = backPackage.message;
        }

        return response;
    };

    readonly logout = () => {
        if (this?.connectedUser) {
            this.backSocket.write({ code: Code.LOGOUT, obj: { username: this.connectedUser.userInfo.username } });
        }
    };

    readonly remove = () => {
        Client.sockets.delete(this.id);
    };

    readonly switchMenu = (newMenu: MenuFunc) => {
        this.currMenu.off();
        this.currMenu = newMenu(this);
        this.currMenu.on();
    };

    readonly addUser = (userInfo: LoginMessage): TokenType => {
        this.connectedUser = new ConnectedUser(this.backSocket, this.frontSocket, userInfo, this.logout);
        return this.connectedUser.token;
    };

    readonly writeBackend = async (
        fn: (message?: Message) => BackendWriteOpts,
        backendMap: BackListener,
        frontMessage?: Message,
    ): Promise<ClientResponse> => {
        if (!this.backSocket.connected) {
            return {
                statusCode: StatusCodes.GATEWAY_TIMEOUT,
                reason: 'Backend Unavailable',
            };
        }

        const backendWriteOpts = fn(frontMessage);

        if (backendWriteOpts?.error) {
            return {
                statusCode: backendWriteOpts?.statusCode || StatusCodes.BAD_GATEWAY,
                reason: backendWriteOpts.error,
            };
        }

        const writeResponse = await this.backSocket.write(backendWriteOpts); // check arg

        if (writeResponse.statusCode !== StatusCodes.OK) {
            return writeResponse;
        }

        const readResponse = await this.backSocket.read();

        if (isClientResponse(readResponse)) {
            return writeResponse;
        }

        const buffer: Buffer = readResponse;

        const backPackage: Package = BackendSocket.decodeData(buffer);

        console.log(backPackage);

        if (backendMap.has(backPackage.code)) {
            const response = backendMap.get(backPackage.code)({ frontMessage, backMessage: backPackage?.message });
            console.log('sending ', response);
            return response;
        }

        console.log('error', backPackage);
        const response: ClientResponse = {
            statusCode: StatusCodes.BAD_GATEWAY,
            reason: ReasonPhrases.BAD_GATEWAY,
        };
        if (backPackage?.message) {
            response.reason = backPackage.message;
        }
        return response;
    };

    readonly generateFrontListener =
        (fn: (message?: Message) => BackendWriteOpts, backendMap: BackListener) =>
        async (frontMessage: Message, callback: FrontCallback) =>
            callback(await this.writeBackend(fn, backendMap, frontMessage));

    /*
    readonly generateFrontListener = (fn: (message?: Message) => BackendWriteOpts, backendMap: BackListener) => {
        // NOTE: Front end always has to send message and callback, check for that!
        return async (frontMessage: Message, callback: FrontCallback) => {
            if (!this.backSocket.connected) {
                const response: ClientResponse = {
                    statusCode: StatusCodes.GATEWAY_TIMEOUT,
                    reason: 'Backend Unavailable',
                };
                return callback(response);
            }

            const result: BackendWriteOpts = fn(frontMessage);

            if (result?.error) {
                const response: ClientResponse = {
                    statusCode: result?.statusCode || StatusCodes.BAD_GATEWAY,
                    reason: result.error,
                };
                return callback(response);
            }

            const writeResponse = await this.backSocket.write(result); // check arg

            if (writeResponse.statusCode !== StatusCodes.OK) {
                return callback(writeResponse);
            }

            const readResponse = await this.backSocket.read();

            if (isClientResponse(readResponse)) {
                return callback(writeResponse);
            }

            const buffer: Buffer = readResponse;

            const backPackage: Package = BackendSocket.decodeData(buffer);

            console.log(backPackage);

            if (backendMap.has(backPackage.code)) {
                const response = backendMap.get(backPackage.code)({ frontMessage, backMessage: backPackage?.message });
                console.log('sending ', response);
                return callback(response);
            }

            console.log('error', backPackage);
            const response: ClientResponse = {
                statusCode: StatusCodes.BAD_GATEWAY,
                reason: ReasonPhrases.BAD_GATEWAY,
            };
            if (backPackage?.message) {
                response.reason = backPackage.message;
            }
            return callback(response);
        };
    };
    */
}
