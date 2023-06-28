import { BSON } from 'bson';
import { DataListener, Package, Code } from './types/types';
import { Socket, createConnection } from 'net';

const host = '127.0.0.1';
const port = 40200;

type SocketKeys = {
    [id: string]: BackendSocket;
};

export class BackendSocket {
    socket: Socket;
    static SocketMap: SocketKeys = {};

    constructor(id: string) {
        this.socket = createConnection({ host, port });
        BackendSocket.SocketMap[id] = this;
    }

    write(code: Code, obj: object) {
        this.socket.write(new Uint8Array([code]));
        this.socket.write(BSON.serialize(obj));
    }

    addDataListener(dataListener: DataListener) {
        this.socket.on('data', dataListener);
    }

    removeDataListener(dataListener: DataListener) {
        this.socket.removeListener('data', dataListener);
    }

    static decodeData(data: Buffer): Package {
        let msg: Package = { code: data[0] };

        const msgLen = data.readIntLE(1, 4);

        if (msgLen > 0) {
            msg = {
                code: msg.code,
                ...BSON.deserialize(data.subarray(1)),
            };
        }

        return msg;
    }

    static getSocket(id: string) {
        return BackendSocket.SocketMap[id];
    }
}
