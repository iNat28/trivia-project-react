const storagePrefix = 'trivia_';

const storage = {
    store: (key: string, obj: unknown) => {
        console.log('storing', obj);

        try {
            sessionStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(obj));
            return true;
        } catch (err) {
            return false;
        }
    },

    lookup: (key: string): unknown => {
        try {
            const userInfoStr = sessionStorage.getItem(`${storagePrefix}${key}`);
            if (!userInfoStr) {
                return null;
            }

            console.log('looked up', JSON.parse(userInfoStr));
            return JSON.parse(userInfoStr);
        } catch (err) {
            return null;
        }
    },

    clear: (key: string) => {
        try {
            sessionStorage.removeItem(`${storagePrefix}${key}`);
            return true;
        } catch (err) {
            return false;
        }
    },
};

export default storage;
