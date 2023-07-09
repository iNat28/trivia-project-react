import { SOCKET_TIMEOUT } from '@/lib/socket';

export function sleep(ms = SOCKET_TIMEOUT) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
