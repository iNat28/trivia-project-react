import { BackendSocket } from '../backend';
import { LogOut, feEventListener } from '../types/types';
import { LoginMenu } from './login-menu';
import { Menu } from './menu';

export class MainMenu extends Menu {
    frontListeners: feEventListener[] = [
        {
            ev: 'logout',
            listener: this.logoutFrontListener,
        },
    ];

    logoutFrontListener() {
        if ('username' in this.client) {
            const logOutMsg: LogOut = { username: this.client.username };
            this.client.backSocket.write(12, logOutMsg);
        }
    }

    backListener(data: Buffer) {
        const msg = BackendSocket.decodeData(data);

        console.log(msg);

        switch (msg.code) {
            case 12: {
                console.log('logged out');
                this.client.isLoggedIn = false;
                this.client.currMenu.off();
                this.client.currMenu = new LoginMenu(this.client);
                this.client.currMenu.on();
                this.client.frontSocket.emit('logout-success');
                break;
            }
            default: {
                console.log('error', msg);
                this.client.frontSocket.sendError(msg);
            }
        }
    }
}
