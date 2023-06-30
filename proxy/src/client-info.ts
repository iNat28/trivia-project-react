import { Socket } from 'socket.io';
import { BackendSocket } from './backend';
import { ClientSocket } from './frontend';
import { Menu } from './menu/menu';
import { MenuManager } from './menu/menu-manager';
import { BackListener, BackendWriteOpts, Code, FrontCallback, MenuFunc, Message, Package } from './types/types';

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
        this.backSocket.socket.stream.on('close', (hadError) => {
            if (hadError) {
                console.log('error connecting to backend');
                this.frontSocket.emit('error-connecting-backend');
            } else {
                console.log('closed backend');
            }
        });

        this.backSocket.socket.stream.on('error', (err) => {
            console.log('error: ');
            console.log(err);
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
                callback('error - backend not connected');
                return;
            }

            const result: BackendWriteOpts = fn(frontMessage);

            if (result.code == Code.ERROR_CODE) {
                callback(result.obj);
                return;
            }

            if (!(await this.backSocket.write(result))) {
                callback('error - timout - write');
                return;
            } // check arg

            const buffer: Buffer = await this.backSocket.read();

            if (buffer === undefined) {
                callback('error - timeout - read');
                return;
            }

            const backPackage: Package = BackendSocket.decodeData(buffer);

            console.log(backPackage);

            if (backendMap.has(backPackage.code)) {
                callback(backendMap.get(backPackage.code)({ frontMessage, backMessage: backPackage?.message }));
            } else {
                console.log('error', backPackage);
                if (backPackage?.message) {
                    callback('error - ' + backPackage.message);
                    return;
                }
                callback(backPackage);
            }
        };
    };
}
