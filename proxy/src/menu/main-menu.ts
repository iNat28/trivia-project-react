import { BackListenerMap, Code, FrontListener } from '../types/types';
import { Menu } from './menu';

export class MainMenu extends Menu {
    logoutBack = () => {
        console.log('logged out');
        this.client.isLoggedIn = false;
        this.client.switchMenu(this.client.menus.login);
        return 'logout-success';
    };

    logoutFront = this.client.generateFrontListener(() => {
        console.log('logging user out...');
        return { code: Code.LOGIN, obj: { username: this.client.username } };
    }, new BackListenerMap([[Code.LOGIN, this.logoutBack]]));

    frontListeners: FrontListener[] = [
        {
            ev: 'logout',
            listener: this.logoutFront,
        },
    ];
}
