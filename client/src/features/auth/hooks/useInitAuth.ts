/*
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
*/

import { useAppDispatch, useListenersOnce } from '@/hooks';
import { setLoginStatus } from '../slices';
import { LoginStatus } from '../types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { UserInfo } from '@/types/types';
export default function useInitAuth(
    setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>,
    clearToken: VoidFunction,
) {
    const dispatch = useAppDispatch();

    useListenersOnce([
        [
            'login-success',
            (userInfo: UserInfo) => {
                console.log('user logged in', userInfo);
                setUserInfo(userInfo);
                dispatch(setLoginStatus(LoginStatus.LoggedIn));
            },
        ],
        [
            'login-none',
            () => {
                clearToken();
                dispatch(setLoginStatus(LoginStatus.LoggedOut));
            },
        ],
    ]);
}
