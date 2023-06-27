import { Client } from '../client-info';
import { MenuFunc } from '../types/types';
import { LoginMenu } from './login-menu';
import { MainMenu } from './main-menu';

export class MenuManager {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    login: MenuFunc = () => {
        return new LoginMenu(this.client);
    };

    main: MenuFunc = () => {
        return new MainMenu(this.client);
    };
}
