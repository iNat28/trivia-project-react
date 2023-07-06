import { ReactNode, createContext } from 'react';
import { LoginStatus, UserInfo } from '../types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { login as _login, logout as _logout, getLoginStatus } from '../slices';
import useInitAuth from '../hooks/useInitAuth';
import { useUserInfoStorage } from '../hooks/useUserInfoStorage';

type AuthContextType = {
    loginStatus: LoginStatus;
    userInfo: UserInfo | undefined;
    login: (userInfo: UserInfo, _successCallback?: VoidFunction) => Promise<void>;
    logout: (_successCallback?: VoidFunction) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { userInfo, setUserInfo, clearUserInfo } = useUserInfoStorage();
    const loginStatus = useAppSelector(getLoginStatus);
    const dispatch = useAppDispatch();

    useInitAuth();

    async function login(userInfo: UserInfo, _successCallback?: VoidFunction) {
        await dispatch(
            _login({
                userInfo: userInfo,
                successCallback: () => {
                    console.log('login in successsss');
                    setUserInfo(userInfo);
                    if (_successCallback) {
                        _successCallback();
                    }
                },
            }),
        );
    }

    async function logout(_successCallback?: VoidFunction) {
        console.log('logging out...');

        await dispatch(
            _logout({
                successCallback: () => {
                    clearUserInfo();
                    if (_successCallback) {
                        _successCallback();
                    }
                },
            }),
        );
    }

    const value: AuthContextType = {
        loginStatus,
        userInfo,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
