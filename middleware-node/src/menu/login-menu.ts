import { BackendSocket } from '../backend';
import { LogIn, feEventListener } from '../types/types';
import { userInfo } from '../user-info';
import { MainMenu } from './main-menu';
import { Menu } from './menu';

export class LoginMenu extends Menu {
    frontListeners: feEventListener[] = [
        {
            ev: 'login',
            listener: this.frontListener,
        },
    ];

    id: string;

    frontListener(logIn: LogIn) {
        userInfo.username = logIn.username;
        this.backSocket.write(10, logIn); // check arg
    }

    emit() {
        console.log('error');
    }

    backListener(data: Buffer) {
        const msg = BackendSocket.decodeData(data);

        console.log(msg);

        switch (msg.code) {
            case 10: {
                console.log('logged in');
                userInfo.isLoggedIn = true;
                this.frontSocket.emit('login-success');
                userInfo.currMenu.off();
                userInfo.currMenu = new MainMenu(userInfo.currMenu.frontSocket, userInfo.currMenu.backSocket);
                userInfo.currMenu.on();
                break;
            }
            default: {
                console.log('error', msg);
                this.frontSocket.sendError(msg);
            }
        }
    }
}
