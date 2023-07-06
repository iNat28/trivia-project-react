import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { LoginMessage, FrontListener, Code, BackListenerMap, PackageFuncArgs, PackageFunc } from '../types/types';
import { Menu } from './menu';

export class LoginMenu extends Menu {
    readonly loginBack: PackageFunc = ({ frontMessage }: PackageFuncArgs<LoginMessage>) => {
        console.log('logged in');
        this.client.isLoggedIn = true;
        this.client.username = frontMessage.username;
        this.client.switchMenu(this.client.menus.main);
        return {
            statusCode: StatusCodes.OK,
            reason: ReasonPhrases.OK,
        };
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
