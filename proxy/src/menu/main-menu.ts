import { StatusCodes } from 'http-status-codes';
import { BackListenerMap, Code, FrontListener, PackageFunc } from '../types/types';
import { Menu } from './menu';
import { ConnectedUsers } from '../connected-users';

export class MainMenu extends Menu {
    logoutBack: PackageFunc = () => {
        console.log('logged out');
        if (this.client?.connectedUser) {
            ConnectedUsers.delete(this.client.connectedUser.token);
        }
        this.client.switchMenu(this.client.menus.login);
        return {
            statusCode: StatusCodes.OK,
        };
    };

    logoutFront = this.client.generateFrontListener(() => {
        console.log('logging user out...');
        if (this.client?.connectedUser) {
            return { code: Code.LOGOUT, obj: { username: this.client.connectedUser.userInfo.username } };
        }
        return { code: Code.ERROR_CODE, error: 'Unable to log user out, user not logged in' };
    }, new BackListenerMap([[Code.LOGOUT, this.logoutBack]]));

    frontListeners: FrontListener[] = [
        {
            ev: 'logout',
            listener: this.logoutFront,
        },
    ];
}
