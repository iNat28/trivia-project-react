import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LoginInfo, attemptLogin } from './socket';
import { RootState } from './store';
import { AppSelecterFunc } from './hooks';
import { storeUserInfo as _storeUserInfo, lookupUserInfo } from './storage';

export enum LoginStatus {
    LoggedIn,
    LoggedOut,
    Pending,
    Error,
}

interface ClientStatus {
    backend: boolean;
    proxy: boolean;
    loggedIn: LoginStatus;
}

interface ClientState {
    status: ClientStatus;
    loginInfo?: LoginInfo;
    storedUserInfo?: LoginInfo;
    errorMsg?: string;
}

function getInitialState() {
    const initialState: ClientState = {
        status: {
            backend: false,
            proxy: false,
            loggedIn: LoginStatus.LoggedOut,
        },
    };

    return initialState;
}

const clientSlice = createSlice({
    name: 'client',
    initialState: getInitialState(),
    reducers: {
        setBackendStatus(state, action: PayloadAction<boolean>) {
            state.status.backend = action.payload;
        },
        setProxyStatus(state, action: PayloadAction<boolean>) {
            state.status.proxy = action.payload;
        },
        setLoginStatus(state, action: PayloadAction<LoginStatus>) {
            state.status.loggedIn = action.payload;
        },
        login(state, action: PayloadAction<LoginInfo>) {
            if (!state.status.backend) {
                console.log('unable to login, backend not connected');
                return;
            }

            if (attemptLogin(action.payload)) {
                state.status.loggedIn = LoginStatus.Pending;
                state.loginInfo = action.payload;
            }
        },
        setLoginInfo(state, action: PayloadAction<LoginInfo>) {
            state.loginInfo = action.payload;
        },
        saveUserInfo(state) {
            if (!state?.storedUserInfo && state.loginInfo) {
                _storeUserInfo(state.loginInfo);
            }
        },
        setErrorMsg(state, action: PayloadAction<string>) {
            state.errorMsg = action.payload;
        },
        setStoredUserInfo(state, action: PayloadAction<LoginInfo>) {
            state.storedUserInfo = action.payload;
        },
    },
});

export const {
    setBackendStatus,
    setProxyStatus,
    setLoginStatus,
    login,
    saveUserInfo,
    setLoginInfo,
    setErrorMsg,
    setStoredUserInfo,
} = clientSlice.actions;

const clientReducer = clientSlice.reducer;
export default clientReducer;

export const isConnectedProxy: AppSelecterFunc<boolean> = (state: RootState) => state.client.status.proxy;
export const isConnectedBack: AppSelecterFunc<boolean> = (state: RootState) => state.client.status.backend;
export const isLoggedIn: AppSelecterFunc<LoginStatus> = (state: RootState) => state.client.status.loggedIn;
export const errorMsg: AppSelecterFunc<string | undefined> = (state: RootState) => state.client?.errorMsg;
