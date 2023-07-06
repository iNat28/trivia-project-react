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

    readonly write = async ({ code, obj }: BackendWriteOpts): Promise<Error | void> => {
        if (!this.connected) {
            return Error('unable to write to backend, backend not connected');
        }

        try {
            const buffer = Buffer.from(new Uint8Array([code, ...BSON.serialize(obj)]));
            this.socket.setTimeout(timeoutMs);
            const written = await this.socket.write(buffer);
            this.socket.setTimeout(0);
            console.log(`buffer length: ${buffer.length}, written: ${written}`);

            if (written !== buffer.length) {
                return Error(`unable to write all of buffer of length ${buffer.length} to the backend`);
            }
        } catch (e) {
            if (!(e instanceof TimeoutError)) {
                this.connected = false;
            }

            if (e instanceof Error) {
                return e;
            }

            throw e;
        }
    };

    readonly addDataListener = (dataListener: DataListener) => {
        this.socket.stream.on('data', dataListener);
    };

    readonly removeDataListener = (dataListener: DataListener) => {
        this.socket.stream.removeListener('data', dataListener);
    };

    readonly read = async (): Promise<Buffer | Error> => {
        if (!this.connected) {
            return Error('unable to read from backend, backend not connected');
        }

        try {
            this.socket.setTimeout(timeoutMs);
            const buffer = await this.socket.read();
            this.socket.setTimeout(0);

            return buffer as Buffer;
        } catch (e) {
            if (!(e instanceof TimeoutError)) {
                this.connected = false;
            }

            if (e instanceof Error) {
                console.log('timeout error');
                return e;
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
