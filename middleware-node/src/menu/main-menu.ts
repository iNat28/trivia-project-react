import { BackendSocket } from '../backend';
import { LogOut, feEventListenerSelf } from '../types/types';
import { userInfo } from '../user-info';
import { LoginMenu } from './login-menu';
import { Menu } from './menu';

export class MainMenu extends Menu {
    frontListenersSelf: feEventListenerSelf[] = [
        {
            ev: 'logout',
            listener: this.logoutFrontListener,
        },
    ];

    logoutFrontListener(self: Menu) {
        console.log('main-menu frontListener');

        const logOutMsg: LogOut = { username: userInfo.username };
        self.backSocket.write(12, logOutMsg);
    }

    backListenerSelf(self: Menu, data: Buffer) {
        console.log('main-menu backListener');

        const msg = BackendSocket.decodeData(data);

        console.log(msg);

        switch (msg.code) {
            case 12: {
                console.log('logged out');
                userInfo.isLoggedIn = false;
                userInfo.currMenu.off();
                userInfo.currMenu = new LoginMenu(userInfo.currMenu.frontSocket, userInfo.currMenu.backSocket);
                userInfo.currMenu.on();
                self.frontSocket.emit('logout-success');
                break;
            }
            default: {
                console.log('error', msg);
                self.frontSocket.sendError(msg);
            }
        }
    }
}
