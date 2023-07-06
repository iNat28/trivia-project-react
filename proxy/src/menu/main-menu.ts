import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { BackListenerMap, Code, FrontListener, PackageFunc } from '../types/types';
import { Menu } from './menu';

export class MainMenu extends Menu {
    logoutBack: PackageFunc = () => {
        console.log('logged out');
        this.client.isLoggedIn = false;
        this.client.switchMenu(this.client.menus.login);
        return {
            statusCode: StatusCodes.OK,
            reason: ReasonPhrases.OK,
        };
    };

    logoutFront = this.client.generateFrontListener(() => {
        console.log('logging user out...');
        return { code: Code.LOGOUT, obj: { username: this.client.username } };
    }, new BackListenerMap([[Code.LOGOUT, this.logoutBack]]));

    frontListeners: FrontListener[] = [
        {
            ev: 'logout',
            listener: this.logoutFront,
        },
    ];
}
