import { createFrontend } from './frontend';
import { LoginMenu } from './menu/login-menu';
import { Client } from './client-info';

const io = createFrontend();

io.on('connection', (socket) => {
    const client = new Client(socket);

    console.log('user connected, total sockets count:', Client.sockets.size);

    client.currMenu = new LoginMenu(client);
    client.currMenu.on();

    client.init();
});
