import { BackendSocket } from '../backend';
import { Client } from '../client-info';
import { LogIn, feEventListenerSelf, feEventListener } from '../types/types';
import { MainMenu } from './main-menu';
import { Menu } from './menu';

export class LoginMenu extends Menu {
    frontListeners: feEventListener[] = [
        {
            ev: 'login',
            listener: this.frontListener,
        },
    ];

    frontListener(logIn: LogIn) {
        this.client.username = logIn.username;
        this.client.backSocket.write(10, logIn); // check arg
    }

    backListener(data: Buffer) {
        const msg = BackendSocket.decodeData(data);

        console.log(msg);

        switch (msg.code) {
            case 10: {
                console.log('logged in');
                this.client.isLoggedIn = true;
                this.client.frontSocket.emit('login-success');
                this.client.currMenu.off();
                this.client.currMenu = new MainMenu(this.client);
                this.client.currMenu.on();
                break;
            }
            default: {
                console.log('error', msg);
                this.client.frontSocket.sendError(msg);
            }
        }
    }
}
