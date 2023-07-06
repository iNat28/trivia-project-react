import { useAppDispatch } from '@/hooks';
import { useEffect } from 'react';
import { LoginStatus } from '../types';
import { setLoginStatus, login } from '../slices';
import { useUserInfoStorage } from './useUserInfoStorage';
import { initLogin } from '../api';

export default function useInitAuth() {
    const { userInfo, setUserInfo } = useUserInfoStorage();
    const dispatch = useAppDispatch();

    useEffect(
        () =>
            initLogin(() => {
                if (!userInfo) {
                    dispatch(setLoginStatus(LoginStatus.LoggedOut));
                    return;
                }

                dispatch(login({ userInfo: userInfo, successCallback: () => setUserInfo(userInfo) }));
            }),
        [],
    );
}
