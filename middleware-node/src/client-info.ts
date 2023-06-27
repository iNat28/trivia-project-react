import { Socket } from 'socket.io';
import { BackendSocket } from './backend';
import { ClientSocket } from './frontend';
import { Menu } from './menu/menu';

export class Client {
    isLoggedIn: boolean;
    frontSocket: ClientSocket;
    backSocket: BackendSocket;
    id: string;

    username?: string;
    currMenu?: Menu;
    static sockets: Client[] = [];

    constructor(socket: Socket) {
        this.frontSocket = new ClientSocket(socket);
        this.backSocket = new BackendSocket(socket.id); // auto connects
        this.isLoggedIn = false;
        this.id = socket.id;
        Client.sockets.push(this);
    }

    init() {
        this.backSocket.socket.on('connect', () => {
            console.log('connected to backend');
            this.frontSocket.emit('connect-backend-success');
        });

        this.backSocket.socket.on('error', (err) => {
            console.log('error: ');
            console.log(err);
        });

        this.backSocket.socket.on('close', (hadError) => {
            if (hadError) {
                console.log('error connecting to backend');
                this.frontSocket.emit('error-connecting-backend');
            } else {
                console.log('closed backend');
            }
        });

        this.frontSocket.socket.on('disconnect', () => {
            this.remove();
            console.log('user disconnected, total sockets count:', Client.sockets.length);
            if (this.isLoggedIn) {
                console.log('logging user out');
                this.backSocket.write(12, { username: this.username });
            }
            this.backSocket.socket.destroy();
        });
    }

    remove() {
        Client.sockets = Client.sockets.filter((socket) => {
            socket.id != this.id;
        });
    }

    switchMenu(newMenu: Menu) {
        this.currMenu.off();
        this.currMenu = newMenu;
        this.currMenu.on();
    }
}
