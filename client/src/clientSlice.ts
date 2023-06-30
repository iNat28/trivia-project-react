import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginInfo, attemptLogin } from './socket';
import { GetRootState, RootState } from './store';
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

type Conditions = {
    getState: GetRootState;
    extra: unknown;
};

type LoginReturn = {
    response: Promise<string>;
    loginInfo: LoginInfo;
};

export const tryLogin = createAsyncThunk(
    'client/tryLogin',
    async (loginInfo: LoginInfo, { rejectWithValue }) => {
        const response = await attemptLogin(loginInfo);
        if (response === 'success') {
            return loginInfo;
        }

        return rejectWithValue(response);
    } /*,
    {
        condition: (loginInfo: LoginInfo, { getState, extra }: Conditions) => {
            if (getState().client.status.loggedIn) {
                return false;
            }
        },
    },
    */,
);

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
    extraReducers: (builder) => {
        builder
            .addCase(tryLogin.pending, (state, action) => {
                console.log('trying to log in');
                state.status.loggedIn = LoginStatus.Pending;
            })
            .addCase(tryLogin.fulfilled, (state, action: PayloadAction<LoginInfo>) => {
                console.log('log in success!');
                if (!state?.storedUserInfo) {
                    _storeUserInfo(action.payload);
                    state.storedUserInfo = action.payload;
                }
                state.status.loggedIn = LoginStatus.LoggedIn;
            })
            .addCase(tryLogin.rejected, (state, action) => {
                console.log('error logging in', action);
                state.status.loggedIn = LoginStatus.Error;
                if (action?.payload && typeof action.payload == 'string') {
                    state.errorMsg = action.payload;
                }
            });
    },
});

export const {
    setBackendStatus,
    setProxyStatus,
    setLoginStatus,
    /*login,*/
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
