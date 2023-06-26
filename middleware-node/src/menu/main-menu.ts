import { BackendSocket } from '../backend';
import { LogOut, feEventListener } from '../types/types';
import { userInfo } from '../user-info';
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
        const logOutMsg: LogOut = { username: userInfo.username };
        this.backSocket.write(12, logOutMsg);
    }

    backListener(data: Buffer) {
        const msg = BackendSocket.decodeData(data);

        console.log(msg);

        switch (msg.code) {
            case 12: {
                console.log('logged out');
                userInfo.isLoggedIn = false;
                userInfo.currMenu.off();
                userInfo.currMenu = new LoginMenu(userInfo.currMenu.frontSocket, userInfo.currMenu.backSocket);
                userInfo.currMenu.on();
                this.frontSocket.emit('logout-success');
                break;
            }
            default: {
                console.log('error', msg);
                this.frontSocket.sendError(msg);
            }
        }
    }
}
