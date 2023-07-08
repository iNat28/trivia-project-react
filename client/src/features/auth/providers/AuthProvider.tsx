import { ReactNode, createContext } from 'react';
import { LoginStatus, LoginInfo } from '../types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { login as _login, logout as _logout, getLoginStatus } from '../slices';
import useInitAuth from '../hooks/useInitAuth';
import { useUserInfo } from '../hooks/useUserInfo';
import { useToken } from '../hooks/useToken';
import { UserInfo } from '@/types/types';

type AuthContextType = {
    loginStatus: LoginStatus;
    userInfo: UserInfo | undefined;
    login: (userInfo: LoginInfo, _successCallback?: VoidFunction) => Promise<void>;
    logout: (_successCallback?: VoidFunction) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { userInfo, setUserInfo } = useUserInfo();
    const { setToken, clearToken } = useToken();
    const loginStatus = useAppSelector(getLoginStatus);
    const dispatch = useAppDispatch();

    useInitAuth(setUserInfo, clearToken);

    async function login(loginInfo: LoginInfo, _successCallback?: VoidFunction) {
        await dispatch(
            _login({
                userInfo: loginInfo,
                successCallback: (token: string) => {
                    console.log('login in successsss');
                    setUserInfo({ username: loginInfo.username });
                    setToken(token);
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
                    clearToken();
                    setUserInfo(undefined);
                    if (_successCallback) {
                        _successCallback();
                    }
                },
            }),
        );
    }

    const value: AuthContextType = {
        loginStatus,
        userInfo: loginStatus === LoginStatus.LoggedIn ? userInfo : undefined,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
