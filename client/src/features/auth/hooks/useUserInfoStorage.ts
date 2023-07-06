import { useStorage } from '@/hooks/storage';
import { UserInfo } from '../types';

export const useUserInfoStorage = () => {
    const [userInfo, setUserInfo, clearUserInfo] = useStorage<UserInfo>('userinfo');

    return { userInfo, setUserInfo, clearUserInfo };
};
