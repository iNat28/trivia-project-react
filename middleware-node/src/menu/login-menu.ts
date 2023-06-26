import { BackendSocket } from '../backend';
import { LogIn, feEventListener, feEventListenerSelf } from '../types/types';
import { userInfo } from '../user-info';
import { MainMenu } from './main-menu';
import { Menu } from './menu';

export class LoginMenu extends Menu {
    frontListenersSelf: feEventListenerSelf[] = [
        {
            ev: 'login',
            listener: this.frontListener,
        },
    ];

    id: string;

    frontListener(self: Menu, logIn: LogIn) {
        userInfo.username = logIn.username;
        self.backSocket.write(10, logIn); // check arg
    }

    emit() {
        console.log('error');
    }

    backListenerSelf(self: Menu, data: Buffer) {
        const msg = BackendSocket.decodeData(data);

        console.log(msg);

        switch (msg.code) {
            case 10: {
                console.log('logged in');
                userInfo.isLoggedIn = true;
                self.frontSocket.emit('login-success');
                userInfo.currMenu.off();
                userInfo.currMenu = new MainMenu(userInfo.currMenu.frontSocket, userInfo.currMenu.backSocket);
                userInfo.currMenu.on();
                break;
            }
            default: {
                console.log('error', msg);
                self.frontSocket.sendError(msg);
            }
        }
    }
}
