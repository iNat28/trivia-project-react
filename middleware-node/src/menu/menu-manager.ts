import { Client } from '../client-info';
import { LoginMenu } from './login-menu';
import { MainMenu } from './main-menu';

export class MenuManager {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    login() {
        return new LoginMenu(this.client);
    }

    main() {
        return new MainMenu(this.client);
    }
}
