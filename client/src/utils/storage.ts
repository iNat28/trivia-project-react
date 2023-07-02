const storagePrefix = 'trivia_';

const storage = {
    store: (key: string, obj: unknown) => {
        console.log('storing', obj);
        sessionStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(obj));
    },

    lookup: (key: string): unknown | null => {
        const userInfoStr = sessionStorage.getItem(`${storagePrefix}${key}`);
        if (!userInfoStr) {
            return null;
        }
        console.log('looked up', JSON.parse(userInfoStr));
        return JSON.parse(userInfoStr as string);
    },

    clear: (key: string) => {
        sessionStorage.removeItem(`${storagePrefix}${key}`);
    },
};

export default storage;
