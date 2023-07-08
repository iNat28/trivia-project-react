import storage from './storage';

export const TOKEN_KEY = 'user-token';

export function getToken() {
    const token = storage.lookup(TOKEN_KEY);

    if (token) {
        return token as string;
    }

    return null;
}

export function setToken(token: string) {
    return storage.store(TOKEN_KEY, token);
}

export function clearToken() {
    return storage.clear(TOKEN_KEY);
}
