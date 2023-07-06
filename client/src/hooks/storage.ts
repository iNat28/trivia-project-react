import { useState } from 'react';

const storagePrefix = 'trivia_';

export const useStorage = <T>(
    key: string,
    defaultValue: T | undefined = undefined,
): [T | undefined, typeof setValue, typeof clear] => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const userInfoStr = sessionStorage.getItem(`${storagePrefix}${key}`);
            if (userInfoStr) {
                return JSON.parse(userInfoStr) as T;
            } else {
                sessionStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });

    const setValue = (newValue: T) => {
        try {
            sessionStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(newValue));
        } catch (err) {
            /* empty */
        }

        setStoredValue(newValue);
    };

    const clear = () => {
        try {
            sessionStorage.removeItem(`${storagePrefix}${key}`);
        } catch (err) {
            /* empty */
        }

        setStoredValue(undefined);
    };

    return [storedValue, setValue, clear];
};
