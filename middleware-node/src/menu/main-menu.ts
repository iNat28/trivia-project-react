import { BackListener, Code, LogoutMessage, FrontListener } from '../types/types';
import { Menu } from './menu';

export class MainMenu extends Menu {
    logoutFront = () => {
        if ('username' in this.client) {
            const logOutMsg: LogoutMessage = { username: this.client.username };
            this.client.backSocket.write(Code.LOGOUT, logOutMsg);
        }
    };

    logoutBack = () => {
        console.log('logged out');
        this.client.isLoggedIn = false;
        this.client.switchMenu(this.client.menus.login);
        this.client.frontSocket.emit('logout-success');
    };

    frontListeners: FrontListener[] = [
        {
            ev: 'logout',
            listener: this.logoutFront,
        },
    ];

    backListeners: BackListener = new Map([[Code.LOGOUT, this.logoutBack]]);
}
