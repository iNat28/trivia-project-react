import { useState } from 'react';
import storage from '@/utils/storage';

export const useStorage = <T>(key: string): [T | null, typeof setValue, typeof clear] => {
    const [storedValue, setStoredValue] = useState(() => {
        const value = storage.lookup(key);
        if (value) {
            return value as T;
        }
        return null;
    });

    const setValue = (newValue: T) => {
        console.log('storing:', newValue, 'key:', key);
        if (storage.store(key, newValue)) {
            setStoredValue(newValue);
        }
    };

    const clear = () => {
        storage.clear(key);
        setStoredValue(null);
    };

    return [storedValue, setValue, clear];
};
