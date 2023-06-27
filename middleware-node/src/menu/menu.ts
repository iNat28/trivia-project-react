import { BackendSocket } from '../backend';
import { Client } from '../client-info';
import { FrontListener, BackListener } from '../types/types';

export abstract class Menu {
    abstract frontListeners: FrontListener[];
    abstract backListeners: BackListener;
    client: Client;

    _frontListeners: FrontListener[];
    _backListener: (data: Buffer) => void;

    constructor(client: Client) {
        this.client = client;
    }

    bindListeners() {
        this._frontListeners = this.frontListeners.map((listener) => {
            return {
                ev: listener.ev,
                listener: listener.listener.bind(this),
            };
        });
        this._backListener = this.getBackListener().bind(this);
    }

    getBackListener() {
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
    }

    on() {
        if (!this._backListener) {
            this.bindListeners();
        }

        this._frontListeners.forEach((listener) => {
            this.client.frontSocket.addListener(listener);
        });
        this.client.backSocket.addDataListener(this._backListener);
    }

    off() {
        this._frontListeners.forEach((listener) => {
            this.client.frontSocket.removeListener(listener);
        });
        this.client.backSocket.removeDataListener(this._backListener);
    }
}
