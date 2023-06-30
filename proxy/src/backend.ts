import { BSON, BSONError } from 'bson';
import { DataListener, Package, Code, BackendWriteOpts } from './types/types';
import { Socket } from 'net';
import PromiseSocket, { TimeoutError } from 'promise-socket';

const host = '127.0.0.1';
const port = 40200;
const timeoutMs = 1000;

type SocketKeys = {
    [id: string]: BackendSocket;
};

export class BackendSocket {
    readonly socket: PromiseSocket<Socket>;
    static readonly SocketMap: SocketKeys = {};
    connected: boolean;

    constructor(id: string) {
        this.connected = false;
        this.socket = new PromiseSocket();
        this.socket.stream.pause();

        BackendSocket.SocketMap[id] = this;
    }

    readonly connect = async () => {
        if (this.connected) {
            return 'already-connected';
        }

        try {
            this.socket.setTimeout(timeoutMs);
            await this.socket.connect(port, host);
            this.socket.setTimeout(0);
            this.connected = true;
            return 'connect-backend-success';
        } catch (e) {
            console.log('error connecting', e);
            if (e?.code) {
                console.log(e.code);
            }

            return 'error-connecting-backend';
        }
    };

    // TODO: check if writing was false
    readonly write = async ({ code, obj }: BackendWriteOpts) => {
        if (!this.connected) {
            return false;
        }

        try {
            this.socket.setTimeout(timeoutMs);
            const buffer = Buffer.from(new Uint8Array([code, ...BSON.serialize(obj)]));
            const written = await this.socket.write(buffer);
            this.socket.setTimeout(0);
            console.log(`buffer length: ${buffer.length}, written: ${written}`);

            return written === buffer.length;
        } catch (e) {
            if (e instanceof TimeoutError) {
                return false;
            }
            console.log(e);
            throw e;
        }
    };

    readonly addDataListener = (dataListener: DataListener) => {
        this.socket.stream.on('data', dataListener);
    };

    readonly removeDataListener = (dataListener: DataListener) => {
        this.socket.stream.removeListener('data', dataListener);
    };

    readonly read = async (): Promise<Buffer> => {
        if (!this.connected) {
            return undefined;
        }

        try {
            this.socket.setTimeout(timeoutMs);
            const buffer = await this.socket.read();
            this.socket.setTimeout(0);
            return buffer as Buffer;
        } catch (e) {
            if (e instanceof TimeoutError) {
                console.log('timeout error');
                return undefined;
            }
            console.log(e);
            throw e;
        }
    };

    static decodeData(data: Buffer): Package {
        let msg: Package = { code: data[0] };

        const msgLen = data.readIntLE(1, 4);

        if (msgLen > 0) {
            try {
                msg = {
                    code: msg.code,
                    ...BSON.deserialize(data.subarray(1)),
                };
            } catch (error) {
                if (BSONError.isBSONError(error)) {
                    return {
                        code: Code.ERROR_CODE,
                        message: 'error deserializing bson on proxy',
                    };
                }
                throw error;
            }
        }

        return msg;
    }

    static getSocket(id: string) {
        return BackendSocket.SocketMap[id];
    }
}
