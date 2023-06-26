import { BackendSocket } from '../backend';
import { ClientSocket } from '../frontend';
import { DataListener, feEventListener } from '../types/types';

export abstract class Menu {
    frontSocket: ClientSocket;
    backSocket: BackendSocket;
    abstract frontListeners: feEventListener[];
    _frontListeners: feEventListener[] = [];
    _backListener: DataListener;

    abstract backListener(data: Buffer): void;

    constructor(frontSocket: ClientSocket, backSocket: BackendSocket) {
        this.frontSocket = frontSocket;
        this.backSocket = backSocket;
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

    on() {
        if (!this._backListener) {
            this.bindListeners();
        }

        this._frontListeners.forEach((listener) => {
            this.frontSocket.addListener(listener);
        });
        this.backSocket.addDataListener(this._backListener);
    }

    off() {
        this._frontListeners.forEach((listener) => {
            this.frontSocket.removeListener(listener);
        });
        this.backSocket.removeDataListener(this._backListener);
    }
}
