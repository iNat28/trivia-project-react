import { LoginMessage, FrontListener, BackListener, Code, Message } from '../types/types';
import { Menu } from './menu';

export class LoginMenu extends Menu {
    loginFront = (loginMsg: LoginMessage) => {
        this.client.username = loginMsg.username;
        this.client.backSocket.write(Code.LOGIN, loginMsg); // check arg
    };

    loginBack = () => {
        console.log('logged in');
        this.client.isLoggedIn = true;
        this.client.frontSocket.emit('login-success');
        this.client.switchMenu(this.client.menus.main);
    };

    errorBack = (msg: Message) => {
        this.client.frontSocket.emit('error-logging-in', msg);
    };

    frontListeners: FrontListener[] = [
        {
            ev: 'login',
            listener: this.loginFront,
        },
    ];

    backListeners: BackListener = new Map([
        [Code.LOGIN, this.loginBack],
        [Code.ERROR_CODE, this.errorBack],
    ]);
}
