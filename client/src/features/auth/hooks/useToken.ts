import { useStorage } from '@/hooks/storage';
import { TOKEN_KEY } from '@/utils/token';

export const useToken = () => {
    const [token, setToken, clearToken] = useStorage<string>(TOKEN_KEY);

    return { token, setToken, clearToken };
};
