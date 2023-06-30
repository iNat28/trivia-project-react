import { LoginMessage, FrontListener, Code, BackListenerMap, PackageFuncArgs } from '../types/types';
import { Menu } from './menu';

export class LoginMenu extends Menu {
    readonly loginBack = ({ frontMessage }: PackageFuncArgs<LoginMessage>) => {
        console.log('logged in');
        this.client.isLoggedIn = true;
        this.client.username = frontMessage.username;
        this.client.switchMenu(this.client.menus.main);
        return 'success';
    };

    readonly loginFront = this.client.generateFrontListener((loginMessage: LoginMessage) => {
        console.log('logging in...');
        return { code: Code.LOGIN, obj: loginMessage };
    }, new BackListenerMap([[Code.LOGIN, this.loginBack]]));

    readonly frontListeners: FrontListener[] = [
        {
            ev: 'login',
            listener: this.loginFront,
        },
    ];
}
