import { useAppDispatch, useListenersOnce } from '@/hooks';
import { setErrorMsg, setLoginStatus } from '../slices';
import { LoginStatus } from '../types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { UserInfo } from '@/types/types';
import { useToken } from './useToken';
import { sleep } from '@/utils/sleep';
import { socket } from '@/lib/socket';
export default function useInitAuth(setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>) {
    const { clearToken } = useToken();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkConnection = async () => {
            await sleep();
            if (!socket.socket.connected) {
                dispatch(setLoginStatus(LoginStatus.Error));
                dispatch(setErrorMsg('error connecting to proxy'));
            }
        };

        checkConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useListenersOnce([
        [
            'backend-status',
            (backendErrorMessage: string, loginErrorMessage: string, userInfo?: UserInfo) => {
                console.log('connected to backend? ', backendErrorMessage, loginErrorMessage, userInfo);

                if (backendErrorMessage) {
                    dispatch(setLoginStatus(LoginStatus.Error));
                    dispatch(setErrorMsg(backendErrorMessage));
                    return;
                }

                if (loginErrorMessage) {
                    clearToken();
                    dispatch(setLoginStatus(LoginStatus.LoggedOut));
                    dispatch(setErrorMsg());
                    return;
                }

                if (!userInfo) {
                    console.log("no error messages but didn't receive user info");
                    dispatch(setLoginStatus(LoginStatus.Error));
                    dispatch(setErrorMsg('no user info from proxy'));
                    return;
                }

                console.log('user logged in', userInfo);
                setUserInfo(userInfo);
                dispatch(setLoginStatus(LoginStatus.LoggedIn));
                dispatch(setErrorMsg());
            },
        ],
    ]);
}
