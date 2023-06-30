import { BackendSocket } from '../backend';
import { Client } from '../client-info';
import { FrontListener, BackListener, DataListener } from '../types/types';

export abstract class Menu {
    abstract readonly frontListeners: FrontListener[];
    readonly backListeners?: BackListener;
    readonly client: Client;

    readonly backListener: DataListener;

    constructor(client: Client) {
        this.client = client;
        this.backListener = this.getBackListener();
    }

    readonly getBackListener = (): DataListener => {
        if (!this?.backListeners) {
            return undefined;
        }

        return (data: Buffer) => {
            const msg = BackendSocket.decodeData(data);

            console.log(msg);

            if (this.backListeners.has(msg.code)) {
                this.backListeners.get(msg.code).bind(this)(msg);
            } else {
                console.log('error', msg);
                this.client.frontSocket.sendError(msg);
            }
        };
    };

    readonly on = () => {
        this.frontListeners.forEach((listener) => {
            this.client.frontSocket.addListener(listener);
        });
        if (this.backListener) {
            this.client.backSocket.addDataListener(this.backListener);
        }
    };

    readonly off = () => {
        this.frontListeners.forEach((listener) => {
            this.client.frontSocket.removeListener(listener);
        });
        if (this.backListener) {
            this.client.backSocket.removeDataListener(this.backListener);
        }
    };
}
