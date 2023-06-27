import { BackListener, Code, LogoutMessage, FrontListener } from '../types/types';
import { LoginMenu } from './login-menu';
import { Menu } from './menu';

export class MainMenu extends Menu {
    frontListeners: FrontListener[] = [
        {
            ev: 'logout',
            listener: this.logoutFront,
        },
    ];

    backListeners: BackListener = new Map([[Code.LOGOUT, this.logoutBack]]);

    logoutFront() {
        if ('username' in this.client) {
            const logOutMsg: LogoutMessage = { username: this.client.username };
            this.client.backSocket.write(Code.LOGOUT, logOutMsg);
        }
    }

    logoutBack() {
        console.log('logged out');
        this.client.isLoggedIn = false;
        this.client.switchMenu(new LoginMenu(this.client));
        this.client.frontSocket.emit('logout-success');
    }
}
