import { BSON, BSONError } from 'bson';
import { DataListener, Package, Code, BackendWriteOpts, ClientResponse } from './types/types';
import { Socket } from 'net';
import PromiseSocket, { TimeoutError } from 'promise-socket';
import { StatusCodes } from 'http-status-codes';

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

    readonly write = async ({ code, obj }: BackendWriteOpts): Promise<ClientResponse> => {
        try {
            if (!this.connected) {
                throw Error('unable to write to backend, backend not connected');
            }

            const buffer = Buffer.from(new Uint8Array([code, ...BSON.serialize(obj)]));
            this.socket.setTimeout(timeoutMs);
            const written = await this.socket.write(buffer);
            this.socket.setTimeout(0);
            console.log(`buffer length: ${buffer.length}, written: ${written}`);

            if (written !== buffer.length) {
                throw Error(`unable to write all of buffer of length ${buffer.length} to the backend`);
            }
        } catch (e) {
            if (!(e instanceof TimeoutError)) {
                this.connected = false;
                return {
                    statusCode: StatusCodes.GATEWAY_TIMEOUT,
                    reason: 'backend writing timout',
                };
            }

            if (e instanceof Error) {
                let errorMsg = e.message;

                if (errorMsg.indexOf('\n') > -1) {
                    errorMsg = errorMsg.split('\n')[0];
                }

                return {
                    statusCode: StatusCodes.BAD_GATEWAY,
                    reason: `Error writing to backend: ${errorMsg}`,
                };
            }

            throw e;
        }

        return { statusCode: StatusCodes.OK };
    };

    readonly addDataListener = (dataListener: DataListener) => {
        this.socket.stream.on('data', dataListener);
    };

    readonly removeDataListener = (dataListener: DataListener) => {
        this.socket.stream.removeListener('data', dataListener);
    };

    static readonly getErrorMsg = (error: Error) => {
        let errorMsg = error.message;

        if (errorMsg.indexOf('\n') > -1) {
            errorMsg = errorMsg.split('\n')[0];
        }

        return errorMsg;
    };

    readonly read = async (): Promise<ClientResponse | Buffer> => {
        try {
            if (!this.connected) {
                throw Error('unable to read from backend, backend not connected');
            }

            this.socket.setTimeout(timeoutMs);
            const buffer = (await this.socket.read()) as Buffer;
            this.socket.setTimeout(0);

            return buffer;
        } catch (e) {
            if (!(e instanceof TimeoutError)) {
                console.log('timeout error');

                this.connected = false;
                return {
                    statusCode: StatusCodes.GATEWAY_TIMEOUT,
                    reason: 'backend reading timout',
                };
            }

            if (e instanceof Error) {
                return {
                    statusCode: StatusCodes.BAD_GATEWAY,
                    reason: `Error reading from backend: ${BackendSocket.getErrorMsg(e)}`,
                };
            }

            console.log(e);
            throw e;
        }
    };

    readonly close = () => {
        this.socket.destroy();
    }

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
