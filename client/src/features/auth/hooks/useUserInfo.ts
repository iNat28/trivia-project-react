import { UserInfo } from '@/types/types';
import { useState } from 'react';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>();

    return { userInfo, setUserInfo };
};
