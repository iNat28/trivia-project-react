import { ClientSocket, createFrontend } from './frontend';
import { BackendSocket } from './backend';
import { LoginMenu } from './menu/login-menu';
import { userInfo } from './user-info';

const io = createFrontend();

io.on('connection', (_socket) => {
    const frontSocket = new ClientSocket(_socket);
    const backSocket = new BackendSocket(_socket.id); // auto connects

    console.log('user connected, total sockets count:', ClientSocket.getSocketsCount());

    userInfo.currMenu = new LoginMenu(frontSocket, backSocket);
    userInfo.currMenu.on();

    backSocket.socket.on('connect', () => {
        console.log('connected to backend');
        frontSocket.emit('connect-backend-success');
    });

    backSocket.socket.on('error', (err) => {
        console.log('error: ');
        console.log(err);
    });

    backSocket.socket.on('close', (hadError) => {
        if (hadError) {
            console.log('error connecting to backend');
            frontSocket.emit('error-connecting-backend');
        } else {
            console.log('closed backend');
        }
    });

    frontSocket.socket.on('disconnect', () => {
        frontSocket.remove();
        console.log('user disconnected, total sockets count:', ClientSocket.getSocketsCount());
        if (userInfo.isLoggedIn) {
            console.log('logging user out');
            backSocket.write(12, { username: userInfo.username });
        }
        backSocket.socket.destroy();
    });
});
