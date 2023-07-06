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
    MenuFunc,
    Message,
    Package,
} from './types/types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { TimeoutError } from 'promise-socket';

export class Client {
    isLoggedIn: boolean;
    readonly frontSocket: ClientSocket;
    readonly backSocket: BackendSocket;
    readonly id: string;
    readonly menus: MenuManager;

    username?: string;
    currMenu?: Menu;

    static sockets = new Map<string, Client>();

    constructor(socket: Socket) {
        this.frontSocket = new ClientSocket(socket);
        this.backSocket = new BackendSocket(socket.id);
        this.isLoggedIn = false;
        this.id = socket.id;
        this.menus = new MenuManager(this);
        Client.sockets.set(this.id, this);
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
            if (this.isLoggedIn) {
                console.log('logging user out');
                await this.backSocket.write({ code: Code.LOGOUT, obj: { username: this.username } });
            }
            this.backSocket.socket.destroy();
        });

        await this.backSocket.connect().then((value) => {
            console.log('value: ', value);
            this.frontSocket.emit(value);
        });
    };

    readonly remove = () => {
        Client.sockets.delete(this.id);
    };

    readonly switchMenu = (newMenu: MenuFunc) => {
        this.currMenu.off();
        this.currMenu = newMenu(this);
        this.currMenu.on();
    };

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

            if (writeResponse) {
                if (writeResponse instanceof TimeoutError) {
                    const response: ClientResponse = {
                        statusCode: StatusCodes.GATEWAY_TIMEOUT,
                        reason: 'backend writing timout',
                    };
                    return callback(response);
                }

                let errorMsg = writeResponse.message;

                if (errorMsg.indexOf('\n') > -1) {
                    errorMsg = errorMsg.split('\n')[0];
                }

                const response: ClientResponse = {
                    statusCode: StatusCodes.BAD_GATEWAY,
                    reason: `Error writing to backend: ${errorMsg}`,
                };
                return callback(response);
            }

            const buffer: Buffer | Error = await this.backSocket.read();

            if (buffer instanceof Error) {
                if (buffer instanceof TimeoutError) {
                    const response: ClientResponse = {
                        statusCode: StatusCodes.GATEWAY_TIMEOUT,
                        reason: 'backend reading timout',
                    };
                    return callback(response);
                }

                let errorMsg = buffer.message;

                if (errorMsg.indexOf('\n') > -1) {
                    errorMsg = errorMsg.split('\n')[0];
                }

                const response: ClientResponse = {
                    statusCode: StatusCodes.BAD_GATEWAY,
                    reason: `Error reading from backend: ${errorMsg}`,
                };
                return callback(response);
            }

            const backPackage: Package = BackendSocket.decodeData(buffer);

            console.log(backPackage);

            if (backendMap.has(backPackage.code)) {
                return callback(backendMap.get(backPackage.code)({ frontMessage, backMessage: backPackage?.message }));
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
}
