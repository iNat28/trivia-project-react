import { Client } from '../client-info';
import { feEventListener } from '../types/types';

/*
export interface Menu {
    on: (client: Client) => void;
    off: (client: Client) => void;
    bind: (client: Client) => void;
    frontListeners: feEventListener[];
    backListeners: (data: Buffer) => void;
}

function bindListeners(client: Client) {
    return { _frontListeners, _backListener };
}

export function menuOn(
    client: Client,
    frontListeners: feEventListenerSelf[],
    backListener: (client: Client, data: Buffer) => void,
) {
    const _frontListeners = this.frontListeners.map((listener) => {
        return {
            ev: listener.ev,
            listener: (message?: Message) => listener.listener(client, message),
        };
    });
    const _backListener = (data: Buffer) => this.backListener(client, data);
}

*/

export abstract class Menu {
    abstract frontListeners: feEventListener[];
    abstract backListener(data: Buffer): void;
    client: Client;

    _frontListeners: feEventListener[];
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
        this._backListener = this.backListener.bind(this);
    }

    /*
    bindListeners(client: Client) {
        this._frontListeners = this.frontListeners.map((listener) => {
            return {
                ev: listener.ev,
                listener: (message?: Message) => listener.listener(client, message),
            };
        });
        this._backListener = (data: Buffer) => this.backListener(client, data);
    }
    */

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
