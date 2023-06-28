import { BackendSocket } from '../backend';
import { Client } from '../client-info';
import { FrontListener, BackListener, DataListener } from '../types/types';

export abstract class Menu {
    abstract frontListeners: FrontListener[];
    abstract backListeners: BackListener;
    client: Client;

    backListener: DataListener;

    constructor(client: Client) {
        this.client = client;
        this.backListener = this.getBackListener();
    }

    getBackListener = (): DataListener => {
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

    on = () => {
        this.frontListeners.forEach((listener) => {
            this.client.frontSocket.addListener(listener);
        });
        this.client.backSocket.addDataListener(this.backListener);
    };

    off = () => {
        this.frontListeners.forEach((listener) => {
            this.client.frontSocket.removeListener(listener);
        });
        this.client.backSocket.removeDataListener(this.backListener);
    };
}
