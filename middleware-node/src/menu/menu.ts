import { BackendSocket } from '../backend';
import { ClientSocket } from '../frontend';
import { DataListener, Message, feEventListener, feEventListenerSelf } from '../types/types';

export abstract class Menu {
    frontSocket: ClientSocket;
    backSocket: BackendSocket;
    abstract frontListenersSelf: feEventListenerSelf[];
    frontListeners: feEventListener[] = [];
    backListener: DataListener;

    abstract backListenerSelf(self: Menu, data: Buffer): void;

    constructor(frontSocket: ClientSocket, backSocket: BackendSocket) {
        this.frontSocket = frontSocket;
        this.backSocket = backSocket;
    }

    bindListeners() {
        this.frontListenersSelf.forEach((listener) => {
            this.frontListeners.push({
                ev: listener.ev,
                listener: listener.listener.bind(this),
            });
        });
        this.backListener = this.backListenerSelf.bind(this);
    }

    on() {
        const self = this;

        if (!this.backListener) {
            console.log('binding listeners');
            this.bindListeners();
        }

        this.frontListeners.forEach((listener) => {
            this.frontSocket.addListener(listener);
        });
        this.backSocket.addDataListener(this.backListener);
    }

    off() {
        const self = this;

        this.frontListeners.forEach((listener) => {
            this.frontSocket.removeListener(listener);
        });
        this.backSocket.removeDataListener(this.backListener);
    }
}
